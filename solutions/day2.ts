type parsedInput = number[][];

export function parse(rawInput: string): parsedInput {
  return rawInput
    .trim()
    .split('\n')
    .map((line) => line.split(' ').map((num) => parseInt(num)));
}

function helper(nums: number[]): boolean {
  let prev = nums[0];
  const increasing = nums[1] - nums[0] > 0;
  for (const num of nums.slice(1)) {
    const diff = num - prev;
    if (
      Math.abs(diff) < 1 ||
      Math.abs(diff) > 3 ||
      (increasing && diff < 0) ||
      (!increasing && diff > 0)
    )
      return false;
    prev = num;
  }
  return true;
}

export function A(input: parsedInput): number {
  return input.filter(helper).length;
}

export function B(input: parsedInput): number {
  const log: {}[] = [];
  const safe = input.filter((nums, n) => {
    const perms = [nums].concat(
      nums.map((_, i, numsLocal) => nums.toSpliced(i, 1))
    );
    const answer: boolean = perms.some((perm) => {
      const safe = helper(perm);
      log.push({ n, nums: `${nums}`, perm: `${perm}`, safe });
      return safe;
    });
    log.push({ n, nums: `${nums}`, answer });
    return answer;
  }).length;
  console.table(log);
  return safe;
}
