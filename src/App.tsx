import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full bg-blue-500 text-center p-4 md:w-1/2 md:bg-green-500 md:text-left lg:w-1/3 lg:bg-red-500">
      <h2 className="text-xl font-bold text-white">Responsive Card</h2>
      <p className="text-white">
        This card changes its style based on the screen width.
      </p>
    </div>
  );
}

export default App;
