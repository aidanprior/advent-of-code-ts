import 'dotenv/config';
import { appendFile, readFile, writeFile } from 'fs/promises';
import commandLineArgs from 'command-line-args';
import clipboardy from 'clipboardy';
import { exit } from 'process';

// Commandline options
const optionDefinitions = [
  {
    name: 'day',
    description: `The Advent of Code {bold Day} to run the solution file for.
Looks for files matching the following format {italic.yellow ./solutions/day<{bold day}#>.ts}
If no file exists, it is created from the {italic.yellow ./solutions/day0.ts} template\n`,
    alias: 'd',
    type: Number,
    typeLabel: '{underline integer}',
    defaultOption: true,
  },
  {
    name: 'verbose',
    description:
      'Print extra information from the solution file {italic (passes the debug argument to your solver, up to you to use it!)}\n',
    alias: 'v',
    type: Boolean,
    defaultOption: false,
  },
  {
    name: 'show-parsed',
    description: 'Print the results from the parse function\n',
    alias: 'p',
    type: Boolean,
  },
  {
    name: 'raw-input',
    description: 'Puzzle input\n',
    typeLabel: '{underline string}',
    alias: 'r',
    type: String,
  },
  {
    name: 'file-input',
    description:
      'The file to load puzzle input from.\nBy default will look for a {italic.yellow ./input/day<Day#>.txt} file. If no file is found, {italic (or this option is specified)}\nit will download input from {bold Advent Of Code} {underline.blue https://adventofcode.com/}\n',
    typeLabel: '{underline file}',
    alias: 'f',
    type: String,
  },
  {
    name: 'set-session-token',
    description:
      'Saves the session token for downloading from {bold Advent Of Code} {underline.blue https://adventofcode.com/}. {dim \nTo get your session token, look in your cookies for adventofcode.com}\n',
    type: String,
    typeLabel: '{underline string}',
  },
  {
    name: 'help',
    description: 'Display this usage guide',
    alias: 'h',
    type: Boolean,
    defaultOption: false,
  },
];

let {
  day,
  verbose,
  'show-parsed': showParsed,
  'raw-input': rawInput,
  'file-input': fileInput,
  'set-session-token': sessionToken,
  help,
} = commandLineArgs(optionDefinitions);

if (help) {
  const commandLineUsage = require('command-line-usage');

  console.log(
    commandLineUsage([
      {
        header: 'Advent of Code Typescript Solution Runner',
        content:
          'Generates solution files from a template, Downloads and saves puzzle input, Runs solutions, Copies answers to clipboard.',
      },
      {
        header: 'Synopsis',
        content: [
          '{cyan npm start {underline day-number} [{bold --file-input} {underline file}] [{bold -vp}]}',
          '{cyan npm start --day {underline day-number} [{bold --show-parsed --verbose}]}',
          '{cyan npm start {bold --} --help}',
        ],
      },
      {
        header: 'Examples',
        content: [
          {
            desc: '1. Run solution A {italic (and B if defined)} for day 2',
            example: '{cyan npm start 2}',
          },
          {
            desc: '2. Run solution for day 1 and print parsed input',
            example: '{cyan npm start -d=1 -p}',
          },
          {
            desc: '3. Run solution for day 1 with debug logging and print parsed input',
            example: '{cyan npm start 1 --show-parsed -v}',
          },
          {
            desc: '4. Run solution for day 1 with raw input',
            example: `{cyan npm start --day 1 -r="3   4
4   3
2   5
1   3
3   9
3   3
"}`,
          },
          {
            desc: '5. Setting a session token for automatic downloading\n{dim.italic note the empty double dash needed for npm not to claim the options for itself}',
            example: '{cyan npm start -- --show-parsed}',
          },
          {
            desc: '6. Run solution(s) for day 10 on a test input file with verbose logging',
            example:
              '{cyan npm start -vd 1\n--file-input ./input/day1Test1.txt}',
          },
        ],
      },
      {
        header: 'Options',
        optionList: optionDefinitions,
      },

      {
        content:
          'Project home: {underline https://github.com/aidanprior/advent-of-code-ts}',
      },
    ])
  );
  exit(0);
}

(async () => {
  if (sessionToken) {
    await appendFile('.env', `AOC_SESSION=${sessionToken}\n`);
    exit(0);
  }
  if (!day) {
    console.log(
      'Day not specified! Need to include a day argument, use --help for more info.'
    );
    exit(1);
  }
  console.log(`Day ${day}`);

  let parse, A, B;
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

  if (rawInput && showParsed === undefined) showParsed = true;
  if (showParsed === undefined) showParsed = false;
  let input = rawInput;
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
          console.log('Failed to fetch input');
          console.log(response);
          return;
        }

        input = await response.text();
        await writeFile(`./input/day${day}.txt`, input);
      } catch (error) {
        console.error('Error While trying to fetch input:', error);
        exit(3);
      }
    }
  }

  try {
    const parsedInput = parse(input);

    if (showParsed) {
      console.log('Parsed:');
      console.table(parsedInput);
    }

    const ASoluction = A(verbose, parsedInput);
    console.log('A: ', ASoluction);
    clipboardy.writeSync(ASoluction.toString());

    const BSoluction = B(verbose, parsedInput);
    console.log('B: ', BSoluction);
    clipboardy.writeSync(BSoluction.toString());
  } catch (error) {
    if (error instanceof Error && !/is not a function/.test(error.message))
      console.warn('Error while trying to run day:', error);
  }
})();
