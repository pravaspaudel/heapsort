export function drawEdge(
  ctx: CanvasRenderingContext2D,
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  r: number
): void {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const offsetX = (dx / dist) * r;
  const offsetY = (dy / dist) * r;
  const startX = p1.x + offsetX;
  const startY = p1.y + offsetY;
  const endX = p2.x - offsetX;
  const endY = p2.y - offsetY;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}
