const NODE_RADIUS = 22;

export function drawNode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  value: number,
  scale: number,
  options: {
    isHighlighted?: boolean;
    isSorted?: boolean;
  } = {}
): void {
  const { isHighlighted = false, isSorted = false } = options;

  ctx.beginPath();
  ctx.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);

  if (isSorted) {
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3 / scale;
    ctx.stroke();
  } else if (isHighlighted) {
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3.5 / scale;
    ctx.stroke();
  } else {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2 / scale;
    ctx.stroke();
  }

  ctx.fillStyle = "black";
  ctx.fillText(String(value), x, y);
}

export { NODE_RADIUS };
