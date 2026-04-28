# Pokédex Lite

A sleek, production-grade Pokédex web app built with React + Vite + Tailwind CSS + Framer Motion.

## Features
- 🔍 **Search** — Live search by Pokémon name
- 🎯 **Type Filter** — Filter by all 18 Pokémon types
- ⭐ **Favorites** — Save favorites to localStorage (persists on refresh)
- 📖 **Detail Modal** — Stats, abilities, description, and evolution chain
- 📄 **Pagination** — 24 Pokémon per page with smart page controls
- 💀 **Skeleton Loading** — Graceful loading states
- ⚠️ **Error Handling** — User-friendly error messages
- 📱 **Fully Responsive** — Mobile, tablet, desktop

## Tech Stack
- **React 19** + **Vite 8** — Fast dev/build
- **Tailwind CSS v3** — Utility styling
- **Framer Motion** — Animations & transitions
- **@tanstack/react-query** — Data fetching & caching
- **PokéAPI** — https://pokeapi.co

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open http://localhost:5173

## Design Decisions
- Fetches Gen 1 (151 Pokémon) on load, cached in memory — avoids per-page API round trips for instant search/filter
- Official artwork sprites used for crisp, high-quality images
- Type accent colors dynamically tint card backgrounds for visual identity
- Evolution chain images fetched on modal open, shown with loading skeletons
- Favorites stored in `localStorage` under key `pokefavs`
