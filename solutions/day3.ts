type parsedInput = {
  instruction: (a: number, b: number) => number;
  a: number;
  b: number;
}[];

export function parse(rawInput: string): parsedInput {
  const instructionMap: Record<string, (a: number, b: number) => number> = {
    mul: (a, b) => a * b,
    NoOp: (a, b) => NaN,
  };
  return Array.from(
    rawInput
      .trim()
      .matchAll(/(?<instruction>mul)\((?<A>\d?\d?\d),(?<B>\d?\d?\d)\)/g)
  ).map(({ groups }) => ({
    instruction: instructionMap[groups?.instruction ?? 'NoOp'],
    a: Number(groups?.A),
    b: Number(groups?.B),
  }));
}

export function A(input: parsedInput): number {
  return input.reduce(
    (sum, { instruction, a, b }) => sum + instruction(a, b),
    0
  );
}
