import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useCanvasControls } from "./useCanvasControls";
import { drawNode, NODE_RADIUS } from "./Node";
import { drawEdge } from "./Edge";

interface TreeCanvasProps {
  array: number[];
  highlightedNodes?: { i: number | null; j: number | null };
  swappingNodes?: { i: number | null; j: number | null };
  sortedNodes?: Set<number>;
}

export interface TreeCanvasRef {
  canvas: HTMLCanvasElement | null;
  scale: number;
  offset: { x: number; y: number };
}

export const TreeCanvas = forwardRef<TreeCanvasRef, TreeCanvasProps>(
  ({ array, highlightedNodes, sortedNodes = new Set() }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { scale, offset } = useCanvasControls(canvasRef);

    useImperativeHandle(
      ref,
      () => ({
        canvas: canvasRef.current,
        scale,
        offset,
      }),
      [scale, offset]
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = canvas.parentElement?.clientWidth || 900;
      canvas.height = 540;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      ctx.lineWidth = 2 / scale;
      ctx.font = `${14 / scale}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "#000000";

      const width = canvas.width;

      const positions = array.map((_, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const indexInLevel = i - (2 ** level - 1);
        const nodesAtLevel = 2 ** level;
        const x = ((indexInLevel + 1) / (nodesAtLevel + 1)) * width;
        const y = 60 + level * 90;
        return { x, y };
      });

      for (let i = 0; i < array.length; i++) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < array.length)
          drawEdge(ctx, positions[i], positions[left], NODE_RADIUS);
        if (right < array.length)
          drawEdge(ctx, positions[i], positions[right], NODE_RADIUS);
      }

      const highlight = highlightedNodes || { i: null, j: null };
      for (let i = 0; i < array.length; i++) {
        const { x, y } = positions[i];
        const isHighlighted = highlight.i === i || highlight.j === i;
        const isSorted = sortedNodes.has(i);
        drawNode(ctx, x, y, array[i], scale, { isHighlighted, isSorted });
      }

      ctx.restore();
    }, [array, scale, offset, highlightedNodes, sortedNodes]);

    return (
      <div style={{ width: "100%", height: 540 }}>
        <canvas
          ref={canvasRef}
          style={{
            border: "1px solid #ccc",
            width: "100%",
            height: "100%",
            cursor: "grab",
          }}
        />
      </div>
    );
  }
);

TreeCanvas.displayName = "TreeCanvas";
