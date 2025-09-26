"use client";
import { useEffect, useState } from "react";
import { Dino } from "@/types.ts";
import Link from "next/link";

export default function Home() {
  const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

  useEffect(() => {
    fetch("/api/dinosaurs")
      .then((res) => res.json())
      .then((data) => setDinosaurs(data))
      .catch((error) => console.error("Error fetching dinosaurs:", error));
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Dinosaur List</h1>
      {dinosaurs.length === 0 ? <p>Loading...</p> : (
        <ul>
          {dinosaurs.map((dino) => (
            <li key={dino.name} style={{ marginBottom: "1rem" }}>
              <Link
                href={`/dinosaurs/${dino.name.toLowerCase()}`}
                style={{ textDecoration: "none", color: "blue" }}
              >
                {dino.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
