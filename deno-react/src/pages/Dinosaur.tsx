import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

export default function Dinosaur() {
  const { dinosaur } = useParams<{ dinosaur: string }>();
  const [detail, setDetail] = useState({ name: "", description: "" });

  useEffect(() => {
    if (dinosaur) {
      fetch(`/api/dinosaurs/${dinosaur}`)
        .then((response) => response.json())
        .then((data) => setDetail(data))
        .catch((error) =>
          console.error("Error fetching dinosaur details:", error)
        );
    }
  }, [dinosaur]);

  return (
    <main id="content">
      <h1>Dinosaur Details</h1>
      {dinosaur
        ? (
          <>
            <h2>{detail?.name}</h2>
            <p>{detail.description}</p>
            <Link to="/">Back to Home</Link>
          </>
        )
        : <p>No dinosaur selected.</p>}
    </main>
  );
}
