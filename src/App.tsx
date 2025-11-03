import BoxedArray from "./components/BoxedArray";
import BuildTree from "./components/BuildTree";
import Header from "./components/Header";
import { HeapProvider } from "./components/HeapContext";
import Input from "./components/Input";

const App = () => {
  return (
    <HeapProvider>
      <Header />
      <Input />
      <BuildTree />
      <BoxedArray />
    </HeapProvider>
  );
};

export default App;
