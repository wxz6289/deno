import { useState } from "preact/hooks";

export default function FavoriteButton() {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      type="button"
      className={`btn fav ${isFavorite ? "btn-favorited" : "btn-primary"}`}
    >
      {isFavorite ? "Unfavorite" : "Favorite"}
    </button>
  );
}
