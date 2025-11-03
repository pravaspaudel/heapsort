import { useState, type ChangeEvent } from "react";
import { useHeap } from "./HeapContext";

const Input = () => {
  const [inputValue, setInputValue] = useState("");
  const { array, setArray } = useHeap();

  const handleAdd = () => {
    if (!inputValue) return;
    setArray([...array, Number(inputValue)]);
    setInputValue("");
  };

  const handleAddRandomFive = () => {
    const randomNumbers = Array.from(
      { length: 5 },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray([...array, ...randomNumbers]);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        marginBottom: "15px",
        justifyContent: "center",
      }}
    >
      <input
        type="number"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value)
        }
        style={{
          width: "90px",
          padding: "6px",
          borderRadius: "5px",
          border: "1px solid #555",
        }}
      />

      <button
        onClick={handleAdd}
        style={{
          padding: "6px 12px",
          borderRadius: "5px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Add
      </button>

      <button
        onClick={handleAddRandomFive}
        style={{
          padding: "6px 12px",
          borderRadius: "5px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Add 5 Random
      </button>
    </div>
  );
};

export default Input;
