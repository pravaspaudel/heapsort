import { drawNode, NODE_RADIUS } from "./Node";
import { drawEdge } from "./Edge";
import {
  easeInOutCubic,
  getNodePositions,
  SWAP_DURATION,
} from "../../logic/heapSort";

export function animateSwap(
  canvas: HTMLCanvasElement,
  currentArray: number[],
  i: number,
  j: number,
  scale: number,
  offset: { x: number; y: number },
  sortedSet: Set<number>,
  shouldContinue: () => boolean
): Promise<void> {
  return new Promise((resolve) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve();
      return;
    }

    const positions = getNodePositions(currentArray.length, canvas.width);
    const p1 = positions[i];
    const p2 = positions[j];

    if (!p1 || !p2) {
      resolve();
      return;
    }

    const start = performance.now();
    const from1 = { x: p1.x, y: p1.y };
    const to1 = { x: p2.x, y: p2.y };
    const from2 = { x: p2.x, y: p2.y };
    const to2 = { x: p1.x, y: p1.y };

    const v1 = currentArray[i];
    const v2 = currentArray[j];

    function stepAnim(now: number) {
      const t = Math.min(1, (now - start) / SWAP_DURATION);
      const ease = easeInOutCubic(t);

      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);
      ctx.lineWidth = 2 / scale;
      ctx.font = `${14 / scale}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "#000000";

      for (let k = 0; k < currentArray.length; k++) {
        const left = 2 * k + 1;
        const right = 2 * k + 2;
        if (left < currentArray.length)
          drawEdge(ctx, positions[k], positions[left], NODE_RADIUS);
        if (right < currentArray.length)
          drawEdge(ctx, positions[k], positions[right], NODE_RADIUS);
      }

      for (let k = 0; k < currentArray.length; k++) {
        if (k === i || k === j) continue;
        const { x, y } = positions[k];
        drawNode(ctx, x, y, currentArray[k], scale, {
          isSorted: sortedSet.has(k),
        });
      }

      const cur1 = {
        x: from1.x + (to1.x - from1.x) * ease,
        y: from1.y + (to1.y - from1.y) * ease,
      };
      const cur2 = {
        x: from2.x + (to2.x - from2.x) * ease,
        y: from2.y + (to2.y - from2.y) * ease,
      };

      ctx.beginPath();
      ctx.arc(cur1.x, cur1.y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.lineWidth = 3.5 / scale;
      ctx.strokeStyle = "#000000";
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.fillText(String(v1), cur1.x, cur1.y);

      ctx.beginPath();
      ctx.arc(cur2.x, cur2.y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.lineWidth = 3.5 / scale;
      ctx.stroke();
      ctx.fillText(String(v2), cur2.x, cur2.y);

      ctx.restore();

      if (t < 1 && shouldContinue()) {
        requestAnimationFrame(stepAnim);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(stepAnim);
  });
}
