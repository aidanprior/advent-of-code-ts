export function parse(rawInput: string): number[][] {
  const left: number[] = [],
    right: number[] = [];
  for (const line of rawInput.split('\n')) {
    const nums = Array.from(line.matchAll(/\d+/g));

    if (nums.length !== 2) break;
    left.push(Number(nums[0][0]));
    right.push(Number(nums[1][0]));
  }
  return [left, right];
}

export function A([left, right]: number[][]): number {
  left.sort();
  right.sort();
  let sum = 0;
  for (let i = 0; i < left.length; i++) {
    sum += Math.abs(left[i] - right[i]);
  }
  return sum;
}

export function B([left, right]: number[][]): number {
  const leftCache = {};
  left.forEach((num) => (leftCache[num] = 0));
  right.forEach((num) => leftCache[num]++);
  return left.reduce((sum, num) => sum + num * leftCache[num], 0);
}
