import commandLineArgs from 'command-line-args';
import { optionDefinitions, showHelpAndExit } from './cli';
import 'dotenv/config';
import { appendFile } from 'fs/promises';
import { exit } from 'process';
import {
  checkDay,
  loadCustomFileInput,
  loadOfficialInput,
  loadSolutionFile,
  parseInput,
  runSolution,
  SolutionModule,
  submitSolution,
} from './runner';

type RejectionReason = {
  message: string;
  code: number;
  error?: Error;
};

try {
  let {
    day,
    verbose,
    'show-parsed': showParsed,
    'raw-input': rawInput,
    'file-input': fileInput,
    'set-session-token': sessionToken,
    help,
    'solve-a': solveA,
    'solve-b': solveB,
    'no-solver': noSolver,
    submit,
  } = commandLineArgs(optionDefinitions);

  if (help) showHelpAndExit();
  handleSessionToken();
  checkDay();
  loadSolutionFile(day)
    .then(async (module: SolutionModule) => ({
      module,
      input:
        rawInput || fileInput
          ? await loadCustomFileInput(fileInput)
          : await loadOfficialInput(day),
    }))
    .then(({ module, input }: { module: SolutionModule; input: string }) => ({
      module,
      parsed: parseInput(module.parse, input),
    }))
    .then(({ module, parsed }: { module: SolutionModule; parsed: unknown }) => {
      if (showParsed) {
        console.log('Parsed:');
        console.table(parsed);
      }
      const defaultBehavior =
        solveA === undefined && solveB === undefined && !noSolver;

      if (solveA || (defaultBehavior && module.B === undefined)) {
        runSolution(module.A, 'A', parsed, verbose).then((solution) => {
          if (submit) submitSolution(day, solution, 1);
        });
      }
      if (module.B !== undefined && (solveB || defaultBehavior)) {
        runSolution(module.B, 'B', parsed, verbose).then((solution) => {
          if (submit) submitSolution(day, solution, 2);
        });
      }
    })
    .catch(({ error, message, code }: RejectionReason) => {
      console.error(message);
      console.error(error);
      exit(code);
    });

  /** Handle unknown user supplied commandline options by showing them the help text */
} catch (error) {
  if (error instanceof Error && /UNKNOWN_OPTION/.test(error.message)) {
    console.warn('Unknown option. See usage:');
    showHelpAndExit();
  } else {
    console.error(error);
  }
}

async function handleSessionToken(sessionToken?: string) {
  if (sessionToken) {
    await appendFile('.env', `AOC_SESSION=${sessionToken}\n`);
    exit(0);
  }
}
