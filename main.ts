/**
 * Commandline app to run the specified day's Advent of Code challenge.
 * you can run this script with `npx tsx main.ts <day> [testInput] [showParsed]`.
 *
 *
 *
 * @param {number} day - The day of the challenge to run.
 * @param {string} [testInput] - Optional test input to use instead of fetching the input.
 * @param {boolean} [showParsed=false] - Whether to display the parsed input.
 *
 * @returns prints the solutions to the console and copies the *most recent* (ie. B over A) solution to the clipboard.
 *
 * @throws Will log an error if there is an issue importing the day's module, reading the input file, or fetching the input.
 *
 * @example
 * // Run the challenge for day 1
 * npx tsx main.ts 1
 *
 * @example
 * // Run the challenge for day 17 with test input
 * npx tsx main.ts 17 'test input'
 *
 * @example
 * // Run the challenge for day 2 with test input and show parsed input
 * npx tsx main.ts 2 'test input' true
 */

import 'dotenv/config';
import { readFile, writeFile } from 'fs/promises';
import clipboardy from 'clipboardy';

async function runDay(day: number, testInput?: string, showParsed?: boolean) {
  console.log(`Day ${day}`);

  if (testInput && showParsed === undefined) showParsed = true;
  if (showParsed === undefined) showParsed = false;
  try {
    testInput = (
      await readFile(testInput ?? 'No Test Input File Specified')
    ).toString();
  } catch (error) {
    console.debug(
      `(${testInput
        ?.slice(0, 10)
        .trim()}...) could not be resolved to a file. It is being treated as raw input`
    );
  }

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
  }

  let rawInput: string = 'No input';
  if (testInput) rawInput = testInput;
  else {
    try {
      rawInput = await readFile(`./input/day${day}.txt`, 'utf-8');
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        !/^ENOENT:/.test(error.message ?? 'No message')
      ) {
        console.error('Error While trying to read input:', error);
        return;
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

        rawInput = await response.text();
        await writeFile(`./input/day${day}.txt`, rawInput);
      } catch (error) {
        console.error('Error While trying to fetch input:', error);
      }
    }
  }

  try {
    const parsedInput = parse(rawInput);

    if (showParsed) {
      console.log('Parsed:');
      console.table(parsedInput);
    }

    const ASoluction = A(parsedInput);
    console.log('A: ', ASoluction);
    clipboardy.writeSync(ASoluction.toString());

    const BSoluction = B(parsedInput);
    console.log('B: ', BSoluction);
    clipboardy.writeSync(BSoluction.toString());
  } catch (error) {
    if (error instanceof Error && !/is not a function/.test(error.message))
      console.warn('Error while trying to run day:', error);
  }
}

const day: number = Number(process.argv[2]) ?? 1;
const testInput: string | undefined = /^(true|false)$/.test(process.argv[3])
  ? undefined
  : process.argv[3];
const showParsed: boolean = /^(true|false)$/.test(process.argv[3])
  ? process.argv[3] === 'true'
  : (process.argv[4] ?? 'false') === 'true';

runDay(day, testInput, showParsed);
