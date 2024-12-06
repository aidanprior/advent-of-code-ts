import commandLineUsage from 'command-line-usage';
import { exit } from 'process';

// Commandline options
export const optionDefinitions = [
  {
    name: 'day',
    description: `The Advent of Code day to run the solution file for.
    Looks for files matching the following format {italic.yellow ./solutions/day{reset.bold <day>}.ts}
    If no file exists, it is created from the {italic.yellow ./solutions/day0.ts} template

    {bold flag can be omitted, but value is required in most cases}
    {italic ie. the following are equivalent}
      {cyan npm start -- 3}
      or
      {cyan npm start -- --day=3}
      or
      {cyan npm start -- -d 3}
      or
      {cyan npm start -- --day 3}
`,
    alias: 'd',
    type: Number,
    typeLabel: '{underline integer}',
    defaultOption: true,
  },
  {
    name: 'verbose',
    description: `Print extra information from the solver

        {bold Defaults to Infinity} {dim (all levels)}

        {dim Passes the debug argument to your solver}
        {dim.italic it is up to you to use it!}
      `,
    alias: 'v',
    type: Number,
    typeLabel: '[{underline integer}]',
    defaultOption: false,
    defaultValue: Infinity,
  },
  {
    name: 'show-parsed',
    description: 'Print the results from the parse function\n',
    alias: 'p',
    type: Boolean,
    defaultOption: false,
  },
  {
    name: 'raw-input',
    description: 'Raw Puzzle input\n',
    typeLabel: '{underline string}',
    alias: 'r',
    type: String,
  },
  {
    name: 'file-input',
    description: `The file to load puzzle input from.

      {bold Without this option: }
Will first look for {italic.yellow ./input/day{bold <day>}.txt}
If the file doesn't exist, it will create it with input downloaded from {underline.blue https://adventofcode.com/}

{bold With this option:}
you can specify the exact file to load input from
    `,
    typeLabel: '{underline file}',
    alias: 'f',
    type: String,
  },
  {
    name: 'set-session-token',
    description:
      'Saves the session token for downloading from {underline.blue https://adventofcode.com/}. {dim \nTo get your session token, look in your cookies for} adventofcode.com\n',
    type: String,
    typeLabel: '{underline string}',
  },
  {
    name: 'solver',
    description: `Specifies which solutions to generate, arguments must be a combination of A, B or nothing.
      {dim If not specified, will run B (if implemented), or A.
To not run either solver use an} {italic empty equal sign}
{cyan npm start -- 1 -s{red =}}
      `,
    type: String,
    typeLabel: '{underline A} {underline B} {red ={underline  }}',
    alias: 's',
    multiple: true,
    defaultValue: ['default'],
  },
  {
    name: 'submit',
    description:
      'Submit the solution to {underline.blue https://adventofcode.com/}\n',
    type: Boolean,
  },
  {
    name: 'help',
    description: 'Display this usage guide',
    alias: 'h',
    type: Boolean,
    defaultOption: false,
  },
];

export function showHelpAndExit() {
  console.log(
    commandLineUsage([
      {
        header: 'Advent of Code Typescript Solution Runner',
        content: `- Generates skeleton solution files from a template
                  - Downloads and saves puzzle input from {underline.blue https://adventofcode.com/}
                  - Runs solutions
                  - Copies answers to clipboard
                  - Submits answers to {underline.blue https://adventofcode.com/}`,
      },
      {
        header: 'Synopsis',
        content: [
          '{cyan npm start {bold.red --} [{bold --day | -d}] {underline day} [{bold -f | --file-input}[=] {underline file}] [{bold -p | --show-parsed}] [{bold --submit}] [{bold -s | --solver} {underline A} {underline B}] [{bold -v | --verbose} {underline integer}]}\n',
          '{cyan npm start {bold.red --} [{bold --day | -d}] {underline day} [{bold -r | --raw-input}[=] {underline string}] [{bold --show-parsed --submit}] [{bold --submit}] [{bold -s | --solver} {underline A} {underline B}] [{bold -v | --verbose} {underline integer}]}\n',
          '{cyan npm start {bold.red --} {bold --help}}\n',
          '{cyan npm start {bold.red --} {bold --set-session-token}[=] {underline string}}\n',
          '\n{italic.red Note the empty double dash needed for npm not to claim the options for itself}',
        ],
      },
      {
        header: 'Examples',
        content: [
          {
            desc: '1. Run solution A {italic (or B if defined)} for day 2\n',
            example: '{cyan npm start -- 2}',
          },
          {
            desc: '2. Run solution for day 1 and print parsed input\n',
            example: '{cyan npm start -- -d=1 -p}',
          },
          {
            desc: '3. Run solution for day 1 with debug logging and print parsed input\n',
            example: '{cyan npm start -- 1 --show-parsed --verbose}',
          },
          {
            desc: '4. Run solution for day 1 with raw input\n',
            example: `{cyan npm start -- --day 1 -r="3   4
4   3
2   5
1   3
3   9
3   3
"}
`,
          },
          {
            desc: '5. Submit the solution to part A',
            example: '{cyan npm start -- 5 -s A --submit}\n',
          },
          {
            desc: '6. Parse test input, without running either solver',
            example: `{cyan npm start -- -d 3 --solver= --show-parsed}
            {italic or}
            {cyan npm start -- -d 3 -ps=}
            `,
          },
          {
            desc: '7. Setting a session token for automatic downloading\n',
            example: `{cyan npm start -- 
--set-session-token 3owsdloi{dim.red.italic ...} }`,
          },
          {
            desc: '8. Run solution(s) for day 10 on a test input file with verbose logging level 2\n',
            example:
              '{cyan npm start -v 2 -d 10\n--file-input ./input/day1Test1.txt}',
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
