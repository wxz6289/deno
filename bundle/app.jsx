import { createRoot } from "npm:react-dom@19.2.0/client";

function App() {
  return <h1>Hello, React!</h1>;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);