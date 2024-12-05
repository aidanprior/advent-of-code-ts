type parsedInput = string;

export function parse(rawInput: string): parsedInput {
  return rawInput.trim();
}

function generateRays(
  input: string,
  w: number,
  i: number,
  log: {}[]
): number[][] {
  function generateRay(dx: number, dy: number, x: number, y: number): number[] {
    const ray: number[] = [];
    for (const letter of 'MAS') {
      const i = (y + dy) * w + x + dx;
      const inBounds =
        x + dx < w && x + dx >= 0 && y + dy >= 0 && y + dy < input.length / w;
      if (inBounds && input[i] === letter) {
        ray.push(i);
        x += dx;
        y += dy;
        log.push({
          i,
          x: x + dx,
          y: y + dy,
          dx,
          dy,
          target: letter,
        });
      } else {
        if (ray.length > 0 || true)
          log.push({
            inBounds,
            target: letter,
            actual: input[i] ?? '',
            x: x + dx,
            y: y + dy,
            dx,
            dy,
            rays: ray,
          });
        return [];
      }
    }
    return ray;
  }
  const x = i % w;
  const y = Math.floor(i / w);
  // prettier-ignore
  return [
    generateRay(-1, -1, x, y),
    generateRay( 0, -1, x, y),
    generateRay(+1, -1, x, y),
    generateRay(-1,  0, x, y),
    generateRay(+1,  0, x, y),
    generateRay(-1, +1, x, y),
    generateRay( 0, +1, x, y),
    generateRay(+1, +1, x, y),
  ];
}

export function A(input: parsedInput, debug: boolean): number {
  let i = 0;
  let n = 0;
  const w = input.split('\n')[0].length;
  input = input.replaceAll('\n', '');
  const log: {}[] = [];
  while ((i = input.indexOf('X', i + 1)) !== -1) {
    if (debug)
      log.push({
        i,
        x: i % w,
        y: Math.floor(i / w),
        n,
      });
    const rays = generateRays(input, w, i, log).filter(
      (ray) => ray.length === 3
    );
    if (debug)
      log.push({
        i,
        x: i % w,
        y: Math.floor(i / w),
        rays: rays.map((ray) => ray.toString()),
        n,
      });
    n += rays.length;
  }
  if (debug) console.table(log);
  return n;
}

export function B(input: parsedInput, debug: boolean): number {
  let i = 0;
  let n = 0;
  const w = input.split('\n')[0].length;
  input = input.replaceAll('\n', '');
  while ((i = input.indexOf('A', i + 1)) !== -1) {
    if (i < w || i % w === 0 || i % w === w - 1 || i + w > input.length)
      continue;
    const tl = input[i - w - 1];
    const br = input[i + w + 1];
    const tr = input[i - w + 1];
    const bl = input[i + w - 1];
    if (
      ((tl === 'M' && br === 'S') || (tl === 'S' && br === 'M')) &&
      ((tr === 'M' && bl === 'S') || (tr === 'S' && bl === 'M'))
    )
      n++;
  }
  return n;
}
