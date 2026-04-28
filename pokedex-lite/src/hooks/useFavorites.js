import { useState } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (pokemon) => {
    let updated;

    if (favorites.includes(pokemon)) {
      updated = favorites.filter((p) => p !== pokemon);
    } else {
      updated = [...favorites, pokemon];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };
  return { favorites, toggleFavorite };
};