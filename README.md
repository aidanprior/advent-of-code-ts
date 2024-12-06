# Runner for Typescript Advent Of Code Solutions

- Generates skeleton solution files from a template
- Downloads and saves puzzle input from [Advent Of Code](https://adventofcode.com/)
- Runs solutions
- Copies answers to clipboard
- Submits answers to [Advent Of Code](https://adventofcode.com/)

You need a valid session token from [Advent Of Code](https://adventofcode.com/), to download your puzzle inputs automatically, or you can manually specify test input  
_(see [session token](#getting-the-session-token) for more information)_

## Getting Started

### Prerequisites

- Node.js installed on your machine
- A session token from the Advent Of Code website _(see [session token](#getting-the-session-token) for instructions)_

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

**Either**

- Edit the `.env.template` file in the root directory by pasting in your session token:

  ```env
  AOC_SESSION=<your-session-token>
  ```

  1. Replace `<your-session-token>` with the value you copied in the previous step.
  2. Remove _template_ from the filename
     `.env.template` --> `.env`

- Use the `--set-session-token` commandline argument _(see [options](#options) for more information)_

### Synopsis

```sh
npm start -- [--day | -d] day [-f | --file-input[=] file] [-p |
--show-parsed] [--submit] [-A | --solve-a] [-B | --solve-b] [--no-solver] [-v | --verbose integer]
```

```sh
npm start -- [--day | -d] day [-r | --raw-input[=] string] [--show-parsed
--submit] [--submit] [-A | --solve-a] [-B | --solve-b] [--no-solver] [-v | --verbose integer]
```

```sh
npm start -- --help
```

```sh
npm start -- --set-session-token[=] string
```

_Note the empty double dash needed for npm not to claim the options for itself_

#### Examples

1. **Run solution A (or B if defined) for day 2**

   ```sh
   npm start -- 2
   ```

2. **Run solution for day 1 and print parsed input**

   ```sh
   npm start -- -d=1 -p
   ```

3. **Run solution for day 1 with debug logging and print parsed input**

   ```sh
   npm start -- 1 --show-parsed --verbose
   ```

4. **Run solution for day 1 with raw input**

   ```sh
   npm start -- --day 1 -r="3   4
   4   3
   2   5
   1   3
   3   9
   3   3
   "
   ```

5. **Submit the solution to part A**

   ```sh
   npm start -- 5 -s A --submit
   ```

6. **Parse test input, without running either solver**

   ```sh
   npm start -- -d 3 --no-solver --show-parsed
   ```

7. **Setting a session token for automatic downloading**

   ```sh
   npm start -- --set-session-token 3owsdloi...
   ```

8. **Run solution(s) for day 10 on a test input file with verbose logging level 2**

   ```sh
   npm start -v 2d 10 --file-input ./input/day1Test1.txt
   ```

#### Options

| Option                       | Description                                                                                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-d, --day integer`          | The Advent of Code day to run the solution file for. Looks for files matching the following format `./solutions/day<day>.ts`. If no file exists, it is created from the `./solutions/day0.ts` template. |
| `-v, --verbose [integer]`    | Print extra information from the solver. Defaults to Infinity (all levels). Passes the debug argument to your solver; it is up to you to use it!                                                        |
| `-p, --show-parsed`          | Print the results from the parse function.                                                                                                                                                              |
| `-r, --raw-input string`     | Raw Puzzle input.                                                                                                                                                                                       |
| `-f, --file-input file`      | The file to load puzzle input from. By default will look for a `./input/day<day>.txt` file. If no file is found, (or this option is specified) it will download input from Advent Of Code.              |
| `--set-session-token string` | Saves the session token for downloading from Advent Of Code. To get your session token, look in your cookies for adventofcode.com.                                                                      |
| `-A, --solve-a`              | Explicitly run solver A. Default behavior without this option is to use solver A unless solver B is defined.                                                                                            |
| `-B, --solve-b`              | Explicitly run solver B. Default behavior without this option is to use solver A unless solver B is defined.                                                                                            |
| `--no-solver`                | Explicitly do not run either solver. Takes precedence over `--solve-a` and `--solve-b` if multiple are used. Default behavior without this option is to use solver A unless solver B is defined.        |
| `--submit`                   | Submit the solution to https://adventofcode.com/.                                                                                                                                                       |
| `-h, --help`                 | Display this usage guide.                                                                                                                                                                               |

### Project home: [https://github.com/aidanprior/advent-of-code-ts](https://github.com/aidanprior/advent-of-code-ts)

### License

This project is licensed under the MIT License.
