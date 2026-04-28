import { useQuery } from "@tanstack/react-query";

const fetchPokemonPage = async (page) => {
  const limit = 20;
  const offset = page * limit;

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );

  if (!res.ok) throw new Error("Failed to fetch list");

  const data = await res.json();

  // 🔥 fetch all details in parallel (FAST)
  const detailed = await Promise.all(
    data.results.map(async (p) => {
      const res = await fetch(p.url);
      if (!res.ok) throw new Error("Failed detail fetch");
      return res.json();
    })
  );

  return detailed;
};

export const usePokemon = (page) => {
  return useQuery({
    queryKey: ["pokemon", page],

    queryFn: () => fetchPokemonPage(page),

   
    staleTime: 1000*60*5,
    cacheTime: 1000*60*30, 

    keepPreviousData:true,
    retry: 1,
  });
};