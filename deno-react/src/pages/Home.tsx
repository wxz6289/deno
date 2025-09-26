import { useEffect, useState } from "react";
import { Link } from "react-router";
import "./home.css";

export default function Home() {
  const [dinosaurs, setDinosaurs] = useState<
    { name: string; description: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/dinosaurs")
      .then((response) => response.json())
      .then((data) => setDinosaurs(data))
      .catch((error) => console.error("Error fetching dinosaurs:", error));
  }, []);

  return (
    <main id="content">
      <h1>Welcome to the Dinosaur App</h1>
      <h2>Available Dinosaurs:</h2>
      <p>
        {dinosaurs.map((dinosaur) => (
          <Link to={`/${dinosaur.name}`} key={dinosaur.name} className="dinosaur">
            {dinosaur.name}
          </Link>
        ))}
      </p>
    </main>
  );
}
