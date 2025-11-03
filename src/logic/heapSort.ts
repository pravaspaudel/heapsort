export type Step =
  | { type: "compare"; i: number; j: number | null }
  | { type: "swap"; i: number; j: number }
  | { type: "done"; i: number };

export function generateHeapSortSteps(arr: number[]): Step[] {
  const a = arr.slice();
  const steps: Step[] = [];
  const n = a.length;

  function recordCompare(i: number, j: number | null = null) {
    steps.push({ type: "compare", i, j });
  }
  function recordSwap(i: number, j: number) {
    steps.push({ type: "swap", i, j });
  }
  function recordDone(i: number) {
    steps.push({ type: "done", i });
  }

  // siftDown: maintain heap property
  function siftDown(start: number, end: number) {
    let root = start;
    while (true) {
      const left = 2 * root + 1;
      const right = left + 1;
      let swapIdx = root;

      if (left <= end) {
        recordCompare(left, swapIdx);
        if (a[left] > a[swapIdx]) swapIdx = left;
      }

      if (right <= end) {
        recordCompare(right, swapIdx);
        if (a[right] > a[swapIdx]) swapIdx = right;
      }

      if (swapIdx === root) {
        break;
      } else {
        recordSwap(root, swapIdx);
        const tmp = a[root];
        a[root] = a[swapIdx];
        a[swapIdx] = tmp;
        root = swapIdx;
      }
    }
  }

  const start = Math.floor((n - 2) / 2);
  for (let i = start; i >= 0; i--) {
    siftDown(i, n - 1);
  }

  for (let end = n - 1; end > 0; end--) {
    recordSwap(0, end);
    const tmp = a[0];
    a[0] = a[end];
    a[end] = tmp;

    recordDone(end);
    siftDown(0, end - 1);
  }

  if (n > 0) recordDone(0);

  return steps;
}

const SWAP_DURATION = 500;

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function getNodePositions(arrayLength: number, canvasWidth: number) {
  return Array.from({ length: arrayLength }, (_, i) => {
    const level = Math.floor(Math.log2(i + 1));
    const indexInLevel = i - (2 ** level - 1);
    const nodesAtLevel = 2 ** level;
    const x = ((indexInLevel + 1) / (nodesAtLevel + 1)) * canvasWidth;
    const y = 60 + level * 90;
    return { x, y };
  });
}

export { SWAP_DURATION };
