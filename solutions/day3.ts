type Instruction = { sum: number; doExec: boolean };
type parsedInput = ((instruction: Instruction) => Instruction)[];
class BadRegexError extends Error {}

export function parse(rawInput: string): parsedInput {
  const log: {}[] = [];
  const parsedInput = Array.from(
    rawInput
      .trim()
      .matchAll(
        /(?<instruction>mul|do|don't)\((?<A>\d?\d?\d)?,?(?<B>\d?\d?\d)?\)/g
      )
  ).map((match) => {
    log.push(match.groups ?? {});
    switch (match.groups?.instruction) {
      case 'mul':
        log.push({
          instruction: 'mul',
          op: `${match.groups?.A} * ${match.groups?.B}`,
        });
        return ({ sum, doExec }: Instruction) => ({
          doExec,
          sum: !doExec
            ? sum
            : sum + Number(match.groups?.A) * Number(match.groups?.B),
        });
      case 'do':
        log.push({
          instruction: 'do',
          op: `doExec = true`,
        });
        return ({ sum }: Instruction) => ({ sum, doExec: true });
      case "don't":
        log.push({
          instruction: "don't",
          op: `doExec = false`,
        });
        return ({ sum }: Instruction) => ({ sum, doExec: false });
      default:
        throw new BadRegexError(match.toString());
    }
  });
  console.table(log);
  return parsedInput;
}

export function A(input: parsedInput): number {
  const log: {}[] = [];
  const sum = input.reduce(
    (accum, instruction) => {
      log.push({ sum: accum.sum });
      return instruction(accum);
    },
    {
      sum: 0,
      doExec: true,
    }
  ).sum;
  console.table(log);
  return sum;
}

export function B(input: parsedInput): number {
  return A(input);
}
