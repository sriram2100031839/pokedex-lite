import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import PokemonCard from "./components/PokemonCard";
import PokemonModal from "./components/PokemonModal";
import SkeletonCard from "./components/skeletonCard";

const PAGE_SIZE = 24;
const TOTAL_POKEMON = 151;

const TYPE_COLORS = {
  fire: "#FF6B35", water: "#4FC3F7", grass: "#66BB6A",
  electric: "#FFD54F", psychic: "#F48FB1", ice: "#80DEEA",
  dragon: "#7E57C2", dark: "#78909C", fairy: "#F48FB1",
  normal: "#BCAAA4", fighting: "#EF5350", poison: "#CE93D8",
  ground: "#FFCA28", flying: "#90CAF9", bug: "#A5D6A7",
  rock: "#D7CCC8", ghost: "#B39DDB", steel: "#B0BEC5"
};

const ALL_TYPES = Object.keys(TYPE_COLORS);

export default function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("pokefavs") || "[]"));
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}&offset=0`);
        if (!res.ok) throw new Error("Failed to fetch Pokémon list");
        const data = await res.json();
        const detailed = await Promise.all(data.results.map(p => fetch(p.url).then(r => r.json())));
        setAllPokemon(detailed);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    localStorage.setItem("pokefavs", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = useCallback(id => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);

  const filtered = allPokemon.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase().trim());
    const matchType = selectedType === "all" || p.types.some(t => t.type.name === selectedType);
    const matchFav = !showFavOnly || favorites.includes(p.id);
    return matchSearch && matchType && matchFav;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearchChange = e => { setSearch(e.target.value); setPage(1); };
  const handleTypeChange = t => { setSelectedType(t); setPage(1); };

  return (
    <div className="app-root">
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />
      <header className="site-header">
        <div className="header-inner">
          <div className="logo-group">
            <div className="logo-ball">
              <div className="ball-stripe" />
              <div className="ball-button" />
            </div>
            <h1 className="logo-text">Pokédex<span className="logo-accent">Lite</span></h1>
          </div>
          <div className="header-meta">
            <span className="pokemon-count">{loading ? "Loading…" : `${allPokemon.length} Pokémon`}</span>
            <button className={`fav-toggle-btn ${showFavOnly ? "active" : ""}`} onClick={() => { setShowFavOnly(v => !v); setPage(1); }}>
              <span>{showFavOnly ? "★" : "☆"}</span>Favorites<span className="fav-count">{favorites.length}</span>
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">
        <div className="controls-section">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search Pokémon…" value={search} onChange={handleSearchChange} />
            {search && <button className="clear-btn" onClick={() => { setSearch(""); setPage(1); }}>✕</button>}
          </div>
          <div className="type-filters">
            <button className={`type-chip all-chip ${selectedType === "all" ? "active" : ""}`} onClick={() => handleTypeChange("all")}>All Types</button>
            {ALL_TYPES.map(t => (
              <button key={t} className={`type-chip ${selectedType === t ? "active" : ""}`} style={selectedType === t ? { background: TYPE_COLORS[t], borderColor: TYPE_COLORS[t], color: "#0a0a0f" } : { borderColor: TYPE_COLORS[t] + "66", color: TYPE_COLORS[t] }} onClick={() => handleTypeChange(t)}>{t}</button>
            ))}
          </div>
        </div>
        {!loading && (
          <div className="results-bar">
            <span className="results-count">{filtered.length === 0 ? "No Pokémon found" : `${filtered.length} Pokémon${showFavOnly ? " ★ favorited" : ""}`}</span>
            {(search || selectedType !== "all") && <button className="clear-filters" onClick={() => { setSearch(""); setSelectedType("all"); setPage(1); }}>Clear filters</button>}
          </div>
        )}
        {error && (
          <div className="error-box">
            <span className="error-icon">⚡</span>
            <div>
              <p className="error-title">Failed to load Pokémon</p>
              <p className="error-msg">{error}</p>
            </div>
          </div>
        )}
        <div className="pokemon-grid">
          {loading ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />) : paginated.map((p, i) => (
            <PokemonCard key={p.id} pokemon={p} isFav={favorites.includes(p.id)} onToggleFav={toggleFav} onClick={setSelected} index={i} />
          ))}
        </div>
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-ball" />
            <p className="empty-title">No Pokémon found</p>
            <p className="empty-sub">Try a different name or type filter</p>
          </div>
        )}
        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={safePage === 1} onClick={() => setPage(1)}>«</button>
            <button className="page-btn" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1).reduce((acc, n, idx, arr) => { if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…"); acc.push(n); return acc; }, []).map((item, i) => item === "…" ? <span key={`d${i}`} className="page-dots">…</span> : <button key={item} className={`page-btn ${safePage === item ? "active" : ""}`} onClick={() => setPage(item)}>{item}</button>)}
            <button className="page-btn" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            <button className="page-btn" disabled={safePage === totalPages} onClick={() => setPage(totalPages)}>»</button>
          </div>
        )}
      </main>
      <AnimatePresence>
        {selected && <PokemonModal pokemon={selected} isFav={favorites.includes(selected.id)} onToggleFav={toggleFav} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
