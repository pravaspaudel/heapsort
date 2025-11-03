import React from "react";
import { useHeap } from "./HeapContext";

const BoxedArray: React.FC = () => {
  const { array, sortedIndices } = useHeap() as {
    array: number[];
    sortedIndices?: number[];
  };

  const isSorted = (idx: number) =>
    Array.isArray(sortedIndices) && sortedIndices.includes(idx);

  return (
    <div style={styles.container}>
      <div style={styles.label}>Array:</div>

      <div style={styles.row}>
        {array.map((val, index) => {
          const sorted = isSorted(index);

          const boxStyle = {
            ...styles.box,
            ...(sorted ? styles.sortedBox : {}),
          };

          return (
            <div key={index} style={boxStyle} aria-label={`array-${index}`}>
              {val}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: "12px",
    fontFamily: "monospace",
    fontSize: "18px",
  },
  label: {
    marginBottom: "6px",
  },
  row: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  box: {
    width: "40px",
    height: "40px",
    border: "2px solid black",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    backgroundColor: "white",
    transition: "all 0.2s ease-in-out",
  },
  sortedBox: {
    border: "2px solid green",
    backgroundColor: "#d4f7d4",
  },
};

export default BoxedArray;
