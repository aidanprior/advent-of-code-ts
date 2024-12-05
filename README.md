# Runner for Typescript Advent Of Code Solutions

Generates solution files from a template, Downloads and saves puzzle input, Runs solutions, Copies answers to clipboard.

With a valid session token from [Advent Of Code](https://adventofcode.com/),
It will download your puzzle inputs automatically, or you can manually specify test input

## Getting Started

### Prerequisites

- Node.js installed on your machine
- A session token from the Advent Of Code website _(see below for instructions)_

### Installation

1. Clone the repository:

```sh
git clone https://github.com/aidanprior/advent-of-code-ts.git
cd advent-of-code-ts
```

2. Install the dependencies:

```sh
npm install
```

### Getting the Session Token

To get your session token from the Advent Of Code website:

1. Open your browser and go to [Advent Of Code](https://adventofcode.com/).
2. Log in with your account.
3. Open the developer tools (usually by pressing `F12` or `Ctrl+Shift+I`).
4. Go to the `Application` tab.
5. Under `Storage`, select `Cookies` and find the cookie named `session`.
6. Copy the value of the `session` cookie.

### Configuration

Edit the `.env.template` file in the root directory by pasting in your session token:

```env
AOC_SESSION=<your-session-token>
```

1. Replace `<your-session-token>` with the value you copied in the previous step.
2. Remove _template_ from the filename
   `.env.template` --> `.env`

### Running the Solution

```sh
npm start day-number [--file-input file] [-vp]
npm start --day day-number [--show-parsed --verbose]
npm start -- --help
```

````

#### Examples

1. **Run solution A (and B if defined) for day 2**

   ```sh
   npm start 2
   ```

2. **Run solution for day 1 and print parsed input**

   ```sh
   npm start -d=1 -p
   ```

3. **Run solution for day 1 with debug logging and print parsed input**

   ```sh
   npm start 1 --show-parsed -v
   ```

4. **Run solution for day 1 with raw input**

   ```sh
   npm start --day 1 -r="3   4
   4   3
   2   5
   1   3
   3   9
   3   3
   "
   ```

5. **Setting a session token for automatic downloading**

   ```sh
   npm start -- --show-parsed
   ```

   Note the empty double dash needed for npm not to claim the options for itself.

6. **Run solution(s) for day 10 on a test input file with verbose logging**
   ```sh
   npm start -vd 1 --file-input ./input/day1Test1.txt
   ```

#### Options

- `-d, --day integer`
  The Advent of Code Day to run the solution file for.
  Looks for files matching the following format `./solutions/day<day#>.ts`
  If no file exists, it is created from the `./solutions/day0.ts` template

- `-v, --verbose`
  Print extra information from the solution file (passes the debug argument to your solver, up to you to use it!)

- `-p, --show-parsed`
  Print the results from the parse function

- `-r, --raw-input string`
  Puzzle input

- `-f, --file-input file`
  The file to load puzzle input from.
  By default will look for a `./input/day<Day#>.txt` file. If no file is found, (or this option is specified)
  it will download input from Advent Of Code [https://adventofcode.com](https://adventofcode.com)

- `--set-session-token string`
  Saves the session token for downloading from Advent Of Code [https://adventofcode.com](https://adventofcode.com).
  To get your session token, look in your cookies for adventofcode.com

- `-h, --help`
  Display this usage guide

### Project home: [https://github.com/aidanprior/advent-of-code-ts](https://github.com/aidanprior/advent-of-code-ts)

### License

This project is licensed under the MIT License.
````
