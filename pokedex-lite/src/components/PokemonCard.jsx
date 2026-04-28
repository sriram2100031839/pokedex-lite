import { useState } from "react";
import { motion } from "framer-motion";
const TYPE_COLORS = {fire:"#FF6B35",water:"#4FC3F7",grass:"#66BB6A",electric:"#FFD54F",psychic:"#F48FB1",ice:"#80DEEA",dragon:"#7E57C2",dark:"#78909C",fairy:"#F8BBD9",normal:"#BCAAA4",fighting:"#EF5350",poison:"#CE93D8",ground:"#FFCA28",flying:"#90CAF9",bug:"#A5D6A7",rock:"#D7CCC8",ghost:"#B39DDB",steel:"#B0BEC5"};
const TYPE_BG = {fire:"rgba(255,107,53,0.12)",water:"rgba(79,195,247,0.12)",grass:"rgba(102,187,106,0.12)",electric:"rgba(255,213,79,0.12)",psychic:"rgba(244,143,177,0.12)",ice:"rgba(128,222,234,0.12)",dragon:"rgba(126,87,194,0.12)",dark:"rgba(120,144,156,0.12)",fairy:"rgba(248,187,217,0.12)",normal:"rgba(188,170,164,0.12)",fighting:"rgba(239,83,80,0.12)",poison:"rgba(206,147,216,0.12)",ground:"rgba(255,202,40,0.12)",flying:"rgba(144,202,249,0.12)",bug:"rgba(165,214,167,0.12)",rock:"rgba(215,204,200,0.12)",ghost:"rgba(179,157,219,0.12)",steel:"rgba(176,190,197,0.12)"};
export default function PokemonCard({ pokemon, isFav, onToggleFav, onClick, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const mainType = pokemon.types[0]?.type.name || "normal";
  const accent = TYPE_COLORS[mainType] || "#fff";
  const bgTint = TYPE_BG[mainType] || "rgba(255,255,255,0.05)";
  const image = pokemon.sprites?.other?.["official-artwork"]?.front_default || pokemon.sprites?.front_default;
  const dexNum = String(pokemon.id).padStart(3, "0");

  return (
    <motion.div
      className="poke-card"
      style={{ "--accent": accent, "--bg-tint": bgTint }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onClick(pokemon)}
    >
      <button
        className={`card-fav-btn ${isFav ? "is-fav" : ""}`}
        onClick={(e) => { e.stopPropagation(); onToggleFav(pokemon.id); }}
        title={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        {isFav ? "★" : "☆"}
      </button>

      <span className="card-dex-num">#{dexNum}</span>

      <div className="card-img-wrap">
        <div className="card-img-glow" style={{ background: accent }} />
        {!imgLoaded && <div className="card-img-skeleton" />}
        <motion.img
          src={image}
          alt={pokemon.name}
          className="card-img"
          style={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          animate={imgLoaded ? { y: [0, -6, 0] } : {}}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
      </div>

      <h3 className="card-name">{pokemon.name}</h3>

      <div className="card-types">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className="card-type-badge"
            style={{ background: TYPE_COLORS[t.type.name] + "33", color: TYPE_COLORS[t.type.name], borderColor: TYPE_COLORS[t.type.name] + "55" }}
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
