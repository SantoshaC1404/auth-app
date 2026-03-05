import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Hello Auth App</h1>
      <Button variant={"destructive"}>Click me</Button>
    </div>
  );
}

export default App;
