import { useRef, useState } from "react";
import { useHeap } from "./HeapContext";
import { TreeCanvas, type TreeCanvasRef } from "./tree/TreeCanvas";
import { generateHeapSortSteps } from "../logic/heapSort";
import type { Step } from "../logic/heapSort";
import { animateSwap } from "./tree/animations";

const COMPARE_DURATION = 600;
const PAUSE_AFTER_SWAP = 120;
const PAUSE_AFTER_SORTED = 120;

const BuildTree: React.FC = () => {
  const { array: sharedArray, setArray } = useHeap();
  const canvasRef = useRef<TreeCanvasRef>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<{
    i: number | null;
    j: number | null;
  }>({ i: null, j: null });
  const [sortedNodes, setSortedNodes] = useState<Set<number>>(new Set());

  const currentArrayRef = useRef<number[]>([]);

  const stepsRef = useRef<Step[]>([]);
  const currentStepRef = useRef(0);
  const animatingRef = useRef(false);

  function delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  const playSteps = async () => {
    if (isRunning) return;
    const steps = stepsRef.current;
    setIsRunning(true);
    animatingRef.current = true;

    currentArrayRef.current = [...sharedArray];

    for (let sIndex = currentStepRef.current; sIndex < steps.length; sIndex++) {
      if (!animatingRef.current) break;

      const step = steps[sIndex];
      currentStepRef.current = sIndex;

      if (step.type === "compare") {
        setHighlightedNodes({ i: step.i, j: step.j });
        await delay(COMPARE_DURATION);
        setHighlightedNodes({ i: null, j: null });
      } else if (step.type === "swap") {
        const canvasState = canvasRef.current;
        if (canvasState?.canvas) {
          await animateSwap(
            canvasState.canvas,
            currentArrayRef.current,
            step.i,
            step.j,
            canvasState.scale,
            canvasState.offset,
            sortedNodes,
            () => animatingRef.current
          );
          const tmp = currentArrayRef.current[step.i];
          currentArrayRef.current[step.i] = currentArrayRef.current[step.j];
          currentArrayRef.current[step.j] = tmp;

          setArray((prev) => {
            const copy = prev.slice();
            const tmp = copy[step.i];
            copy[step.i] = copy[step.j];
            copy[step.j] = tmp;
            return copy;
          });
        } else {
          const tmp = currentArrayRef.current[step.i];
          currentArrayRef.current[step.i] = currentArrayRef.current[step.j];
          currentArrayRef.current[step.j] = tmp;

          setArray((prev) => {
            const copy = prev.slice();
            const tmp = copy[step.i];
            copy[step.i] = copy[step.j];
            copy[step.j] = tmp;
            return copy;
          });
        }
        await delay(PAUSE_AFTER_SWAP);
      } else if (step.type === "done") {
        setSortedNodes((prev) => new Set(prev).add(step.i));
        await delay(PAUSE_AFTER_SORTED);
      }
    }

    animatingRef.current = false;
    setIsRunning(false);
    currentStepRef.current = 0;
  };

  const handleStartSort = () => {
    if (isRunning || sharedArray.length <= 1) return;

    setHighlightedNodes({ i: null, j: null });
    setSortedNodes(new Set());
    currentStepRef.current = 0;
    currentArrayRef.current = [...sharedArray];

    const steps = generateHeapSortSteps(sharedArray);
    stepsRef.current = steps;

    void playSteps();
  };

  return (
    <div style={{ width: "100%", textAlign: "center", userSelect: "none" }}>
      <div
        style={{
          margin: "8px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={handleStartSort}
          disabled={isRunning || sharedArray.length <= 1}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            backgroundColor:
              isRunning || sharedArray.length <= 1 ? "#9CA3AF" : "#4CAF50",
            color: "white",
            border: "none",
            cursor:
              isRunning || sharedArray.length <= 1 ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            transition: "0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isRunning && sharedArray.length > 1)
              e.currentTarget.style.backgroundColor = "#43a047";
          }}
          onMouseLeave={(e) => {
            if (!isRunning && sharedArray.length > 1)
              e.currentTarget.style.backgroundColor = "#4CAF50";
          }}
        >
          Sort (Heap Sort: Max-Heap)
        </button>

        <span style={{ fontSize: 13 }}>Scroll to zoom</span>
      </div>

      <TreeCanvas
        ref={canvasRef}
        array={sharedArray}
        highlightedNodes={highlightedNodes}
        sortedNodes={sortedNodes}
      />
    </div>
  );
};

export default BuildTree;
