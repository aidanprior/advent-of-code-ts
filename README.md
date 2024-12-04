# Runner for Typescript Advent Of Code Solutions

This repository contains a commandline runner for Advent Of Code challenges implemented in TypeScript.

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

- To run the solution for a specific day, use the following command:

  ```sh
  npm start <day>
  ```

  Replace `<day>` with the day number you want to run (e.g., `1` for Day 1).

- To run on test input, include it in quotes as a commandline argument:

  ```sh
  npm start <day> "<test-input>"
  ```

- If you would like to see the parsed input, include true as a commandline argument

  ```sh
  npm start <day> true
  ```

  - By default, if you specify test input, the parsed input will be printed, but you can explicitly turn this off

    ```sh
    npm start <day> "<test-input>" false
    ```

### License

This project is licensed under the MIT License.
