import commandLineArgs from 'command-line-args';
import { optionDefinitions, showHelpAndExit } from './cli';

import 'dotenv/config';
import { appendFile, readFile, writeFile } from 'fs/promises';
import clipboardy from 'clipboardy';
import { JSDOM } from 'jsdom';
import { exit } from 'process';

try {
  let {
    day,
    verbose,
    'show-parsed': showParsed,
    'raw-input': rawInput,
    'file-input': fileInput,
    'set-session-token': sessionToken,
    help,
    solver,
    submit,
  } = commandLineArgs(optionDefinitions);

  /** Global Variables */
  let input: string;
  let parsedInput: unknown;
  let parse: <T>(rawInput: string) => T;
  let A: (<T>(parsedInput: T, debug: boolean) => number) | undefined;
  let B: (<T>(parsedInput: T, debug: boolean) => number) | undefined;

  /** Main Flow */
  if (help) showHelpAndExit();
  handleSessionToken();
  checkDay();
  loadSolutionFile();
  loadInput();
  parseInput();

  console.log(solver);
  if (solver.includes('A') || (solver.includes('default') && B === undefined)) {
    runSolution(A ?? (() => NaN), 'A').then((solution) => {
      if (submit) submitSolution(solution, 1);
    });
  }
  if (solver.includes('B') || solver.includes('default')) {
    runSolution(B ?? (() => NaN), 'B').then((solution) => {
      if (submit) submitSolution(solution, 1);
    });
  }

  async function handleSessionToken() {
    if (sessionToken) {
      await appendFile('.env', `AOC_SESSION=${sessionToken}\n`);
      exit(0);
    }
  }

  function checkDay() {
    if (!day) {
      console.log(
        'Day not specified! Need to include a day argument, use --help for more info.'
      );
      exit(1);
    }
    console.log(`Day ${day}`);
  }

  async function loadSolutionFile() {
    try {
      const module = await import(`./solutions/day${day}.ts`);
      A = module.A;
      B = module.B;
      parse = module.parse;
    } catch (error: unknown) {
      if (error instanceof Error && !/Cannot find module/.test(error.message)) {
        console.error('Error While trying to import day:', error);
        return;
      }
      const template = await readFile('./solutions/day0.ts', 'utf-8');
      await writeFile(`./solutions/day${day}.ts`, template);
      console.log(`Day ${day} created from template`);
      exit(0);
    }
  }

  async function loadInput() {
    if (rawInput) {
      input = rawInput;
      return;
    }
    if (fileInput) {
      try {
        input = (
          await readFile(fileInput ?? 'No Test Input File Specified')
        ).toString();
      } catch (error) {
        console.error(`Could not resolve input file: ${fileInput}`);
        exit(2);
      }
    } else if (!input) {
      try {
        input = await readFile(`./input/day${day}.txt`, 'utf-8');
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          !/^ENOENT:/.test(error.message ?? 'No message')
        ) {
          console.error(
            `Error While trying to read default input file (./input/day${day}.txt):`,
            error
          );
          exit(2);
        }

        if (!process.env.AOC_SESSION) {
          console.error(
            'Could not load input file, and cannot download one without a session token, try --set-session-token'
          );
          exit(3);
        }

        try {
          const response = await fetch(
            `https://adventofcode.com/2024/day/${day}/input`,
            {
              headers: {
                cookie: `session=${process.env.AOC_SESSION}`,
              },
            }
          );

          if (response.status !== 200) {
            console.log('Could not download input: ', response.statusText);
            exit(3);
          }

          input = await response.text();
          await writeFile(`./input/day${day}.txt`, input);
        } catch (error) {
          console.error('Error While trying to download input: ', error);
          exit(3);
        }
      }
    }
  }
  async function parseInput() {
    try {
      parsedInput = parse(input);

      if (showParsed) {
        console.log('Parsed:');
        console.table(parsedInput);
      }
    } catch (error) {
      if (
        !(error instanceof TypeError) ||
        !/parse is not a function/.test(error.message)
      )
        console.error('Error during parse:\n', error);
    }
  }

  async function runSolution(
    solver: (parsedInput: unknown, debug: boolean) => number,
    label: string
  ): Promise<number> {
    if (solver === undefined) {
      console.error('Solver was not defined!');
      exit(1);
    }
    try {
      const solution = solver(parsedInput, verbose);
      console.log(`${label}: ${solution}`);
      return solution;
    } catch (error) {
      console.error('Error during solve:\n', error);
      exit(1);
    }
  }
  async function submitSolution(solution: number, level: number) {
    if (!process.env.AOC_SESSION) {
      console.error(
        'Cannot submit without a session token, try --set-session-token'
      );
      exit(3);
    }
    try {
      if (!rawInput && !fileInput) {
        console.log('Sending solution to adventofcode.com...\n');
        clipboardy.writeSync(solution.toString());
        const response = await fetch(
          `https://adventofcode.com/2024/day/${day}/answer`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              cookie: `session=${process.env.AOC_SESSION}`,
            },
            body: new URLSearchParams({
              level: level.toString(),
              answer: solution.toString(),
            }),
          }
        );
        const html = await response.text();
        const { document } = new JSDOM(html).window;
        const responseSentence =
          document.querySelector('article > p')?.textContent ??
          'could not parse response p';
        console.log(responseSentence);
      }
    } catch (error) {
      console.error('Error during submission:\n', error);
    }
  }

  /** Handle unknown user supplied commandline options by showing them the help text */
} catch (error) {
  if (error instanceof Error && /UNKNOWN_OPTION/.test(error.message)) {
    console.warn('Unknown option. See usage:');
    showHelpAndExit();
  } else {
    console.error(error);
  }
}
