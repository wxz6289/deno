import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home.tsx";
import Dinosaur from "./pages/Dinosaur.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:dinosaur" element={<Dinosaur />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
