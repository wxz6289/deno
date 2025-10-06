"use client";
import { useEffect, useState } from "react";
import type { Dino } from "../../types.ts";
import { useParams } from "next/navigation";
export default function Home() {
  const { name } = useParams();
  const [dinosaur, setDinosaur] = useState<Dino | null>(null);

  useEffect(() => {
    fetch(`/api/dinosaurs/${name}`)
      .then((res) => res.json())
      .then((data) => setDinosaur(data))
      .catch((error) => console.error("Error fetching dinosaurs:", error));
  }, [name]);
  if (!dinosaur) {
    return (
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Loading...</h1>
      </main>
    );
  }
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>{dinosaur.name}</h1>
      <p>{dinosaur.description}</p>
    </main>
  );
}
