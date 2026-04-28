import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TYPE_COLORS = {
  fire: "#FF6B35", water: "#4FC3F7", grass: "#66BB6A",
  electric: "#FFD54F", psychic: "#F48FB1", ice: "#80DEEA",
  dragon: "#7E57C2", dark: "#78909C", fairy: "#F8BBD9",
  normal: "#BCAAA4", fighting: "#EF5350", poison: "#CE93D8",
  ground: "#FFCA28", flying: "#90CAF9", bug: "#A5D6A7",
  rock: "#D7CCC8", ghost: "#B39DDB", steel: "#B0BEC5",
};

const STAT_LABELS = {
  hp: "HP", attack: "ATK", defense: "DEF",
  "special-attack": "Sp.ATK", "special-defense": "Sp.DEF", speed: "SPD",
};

const getStatColor = (v) => {
  if (v >= 100) return "#66BB6A";
  if (v >= 70) return "#FFD54F";
  if (v >= 45) return "#FF8A65";
  return "#EF5350";
};

export default function PokemonModal({ pokemon, isFav, onToggleFav, onClose }) {
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [evoImages, setEvoImages] = useState({});

  const mainType = pokemon.types[0]?.type.name || "normal";
  const accent = TYPE_COLORS[mainType] || "#fff";
  const dexNum = String(pokemon.id).padStart(3, "0");

  const image =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;

  useEffect(() => {
    const fetchExtra = async () => {
      try {
        const speciesRes = await fetch(pokemon.species.url);
        const speciesData = await speciesRes.json();
        setSpecies(speciesData);

        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        const chain = [];
        let current = evoData.chain;
        while (current) {
          chain.push(current.species.name);
          current = current.evolves_to[0] || null;
        }
        setEvolution(chain);

        // Fetch images for each evo
        const imgs = {};
        await Promise.all(
          chain.map(async (name) => {
            try {
              const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
              const d = await r.json();
              imgs[name] =
                d.sprites?.other?.["official-artwork"]?.front_default ||
                d.sprites?.front_default;
            } catch {}
          })
        );
        setEvoImages(imgs);
      } catch {}
    };
    fetchExtra();
  }, [pokemon]);

  const description =
    species?.flavor_text_entries
      ?.find((e) => e.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ") || "";

  const heightM = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-panel"
        style={{ "--accent": accent }}
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent stripe */}
        <div className="modal-stripe" style={{ background: `linear-gradient(90deg, ${accent}44, transparent)` }} />

        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="modal-dex">#{dexNum}</span>
            <h2 className="modal-name">{pokemon.name}</h2>
            <div className="modal-types">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className="modal-type-badge"
                  style={{ background: TYPE_COLORS[t.type.name] + "33", color: TYPE_COLORS[t.type.name], borderColor: TYPE_COLORS[t.type.name] + "55" }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="modal-header-right">
            <button
              className={`modal-fav-btn ${isFav ? "is-fav" : ""}`}
              onClick={() => onToggleFav(pokemon.id)}
            >
              {isFav ? "★" : "☆"}
            </button>
            <button className="modal-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Pokemon image */}
        <div className="modal-img-area" style={{ background: accent + "18" }}>
          <div className="modal-img-ring" style={{ borderColor: accent + "44" }} />
          <motion.img
            src={image}
            alt={pokemon.name}
            className="modal-img"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </div>

        {/* Info grid */}
        <div className="modal-info-grid">
          <div className="info-cell">
            <span className="info-label">Height</span>
            <span className="info-value">{heightM} m</span>
          </div>
          <div className="info-cell">
            <span className="info-label">Weight</span>
            <span className="info-value">{weightKg} kg</span>
          </div>
          <div className="info-cell">
            <span className="info-label">Base Exp</span>
            <span className="info-value">{pokemon.base_experience || "—"}</span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="modal-description">{description}</p>
        )}

        {/* Stats */}
        <div className="modal-section">
          <h3 className="section-title">Base Stats</h3>
          <div className="stats-list">
            {pokemon.stats.map((s) => (
              <div key={s.stat.name} className="stat-row">
                <span className="stat-label">
                  {STAT_LABELS[s.stat.name] || s.stat.name}
                </span>
                <span className="stat-value">{s.base_stat}</span>
                <div className="stat-bar-bg">
                  <motion.div
                    className="stat-bar-fill"
                    style={{ background: getStatColor(s.base_stat) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(s.base_stat, 150) / 150 * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Abilities */}
        <div className="modal-section">
          <h3 className="section-title">Abilities</h3>
          <div className="abilities-list">
            {pokemon.abilities.map((a) => (
              <span key={a.ability.name} className="ability-pill" style={{ borderColor: accent + "55", color: accent }}>
                {a.ability.name}{a.is_hidden ? " (hidden)" : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Evolution */}
        {evolution.length > 1 && (
          <div className="modal-section">
            <h3 className="section-title">Evolution Chain</h3>
            <div className="evo-chain">
              {evolution.map((evo, i) => (
                <div key={evo} className="evo-chain-item">
                  {i > 0 && (
                    <div className="evo-arrow" style={{ color: accent }}>→</div>
                  )}
                  <div className={`evo-poke ${evo === pokemon.name ? "evo-current" : ""}`}
                    style={evo === pokemon.name ? { borderColor: accent } : {}}>
                    {evoImages[evo] ? (
                      <img src={evoImages[evo]} alt={evo} className="evo-img" />
                    ) : (
                      <div className="evo-img-placeholder" />
                    )}
                    <span className="evo-name">{evo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
