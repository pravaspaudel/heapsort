import { createContext, useContext, useState, type ReactNode } from "react";

interface HeapContextType {
  array: number[];
  setArray: React.Dispatch<React.SetStateAction<number[]>>;
}

const HeapContext = createContext<HeapContextType | null>(null);

export const HeapProvider = ({ children }: { children: ReactNode }) => {
  const [array, setArray] = useState<number[]>([]);
  return (
    <HeapContext.Provider value={{ array, setArray }}>
      {children}
    </HeapContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useHeap = () => {
  const contxt = useContext(HeapContext);
  if (!contxt) throw new Error("useHeap must be used inside HeapProvider");
  return contxt;
};
