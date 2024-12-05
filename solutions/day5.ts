type Update = number[];
type Rules = Record<number, number[]>;
type parsedInput = {
  antiRules: Rules; // negative cases (rules to identify unordered)
  updates: Update[];
};

export function parse(rawInput: string): parsedInput {
  const [rules, updates] = rawInput.trim().split('\n\n');
  return {
    antiRules: rules.split('\n').reduce((ruleObj, line) => {
      const [value, key] = line.split('|').map(Number);
      return { ...ruleObj, [key]: (ruleObj[key] || []).concat(value) };
    }, {} as Rules),
    updates: updates.split('\n').map((line) => line.split(',').map(Number)),
  };
}

let logI = 0;
function isCorrectOrder(
  antiRules: Rules,
  update: Update,
  debug: boolean
): boolean {
  if (debug) console.log(logI++, update);
  const errorSignals: Set<number> = new Set();
  for (const page of update) {
    // console.log('  ', page, errorSignals, antiRules[page]);
    if (errorSignals.has(page)) return false;
    antiRules[page]?.forEach((page) => {
      errorSignals.add(page);
    });
  }
  return true;
}

export function A({ antiRules, updates }: parsedInput, debug = false): number {
  if (debug) console.table(antiRules);
  const sum = updates
    .filter((update) => isCorrectOrder(antiRules, update, debug))
    .reduce((sum, update) => sum + update[Math.floor(update.length / 2)], 0);
  return sum;
}

function fixUpdate(
  antiRules: Rules,
  update: Update,
  debug: boolean
): Update | boolean {
  if (debug) console.log('\n', logI++, update, '\n');
  let errorIndicies: Record<number, number> = {};
  let madeEdit = false;
  for (let i = 0; i < update.length; i++) {
    if (debug)
      console.log(
        `${i}\t${update.map((n, idx) =>
          idx === i ? `[${n}]` : ` ${n} `
        )}`.replaceAll(',', ' ')
      );
    if (errorIndicies[update[i]] !== undefined) {
      madeEdit = true;
      const errorIdx = errorIndicies[update[i]];
      if (debug)
        console.log(
          `\t${update.map((n, idx) =>
            idx === i ? `[${n}]` : idx === errorIdx ? `(${n})` : ` ${n} `
          )}`.replaceAll(',', ' ')
        );
      const temp = update[i];
      update[i] = update[errorIdx];
      update[errorIdx] = temp;
      errorIndicies = {};
      i = 0;
    }
    antiRules[update[i]]?.forEach((page) => {
      errorIndicies[page] = i;
    });
  }
  if (debug)
    if (madeEdit) console.log(`Edited: ${update}`);
    else console.log('Correctly Ordered');
  return madeEdit ? update : false;
}

export function B({ antiRules, updates }: parsedInput, debug = false): number {
  if (debug) console.table(antiRules);
  const sum = updates
    .map((update) => fixUpdate(antiRules, update, debug))
    .filter((update) => Array.isArray(update))
    .reduce(
      (sum, update: Update) => sum + update[Math.floor(update.length / 2)],
      0
    );
  return sum;
}
