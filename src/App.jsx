import { useState } from "react";
import { Layout } from "./components/layout";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [count, setCount] = useState(0);

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="bg-[#0B0D0F]">

      <Layout/>
    </div>
    </DndProvider>
  );
}

export default App;
