import { PageProps } from "$fresh/server.ts";
import data from "../api/data.json" with { type: "json" };
import { Button } from "../index.tsx";
import FavoriteButton from "../../islands/FavoriteButton.tsx";

export default function DinosaurPage({ params }: PageProps) {
  const { name } = params;
  const dinosaur = data.find((d) =>
    d.name.toLowerCase() === name.toLowerCase()
  );

  if (!dinosaur) {
    return (
      <div>
        <h1>Dinosaur not found</h1>
        <Button href="/">Go back</Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Dinosaur: {name}</h1>
      <p>Period: {dinosaur.description}</p>
      <FavoriteButton />
      <Button href="/">Go back</Button>
    </div>
  );
}
