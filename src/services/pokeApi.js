// Archivo para consumir la API (PokéAPI)
const BASE_URL = 'https://pokeapi.co/api/v2';

// Mapea un item de la lista paginada para extraer el ID de la URL y armar la imagen
const mapPokemonListItem = (row) => {
  // La URL viene así: "https://pokeapi.co/api/v2/pokemon/25/"
  const parts = row.url.split('/').filter(Boolean);
  const id = Number(parts[parts.length - 1]);

  return {
    id,
    name: row.name,
    // Imagen oficial sin necesidad de pedir la ficha completa
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
  };
};

// Mapea la ficha completa de un Pokémon (equivalente a mapMeal visto en clase)
const mapPokemonDetail = (row) => {
  const types = [];
  for (let i = 0; i < row.types.length; i++) {
    types.push(row.types[i].type.name);
  }

  const stats = [];
  for (let i = 0; i < row.stats.length; i++) {
    stats.push({
      name: row.stats[i].stat.name,
      baseStat: row.stats[i].base_stat,
    });
  }

  return {
    id: row.id,
    name: row.name,
    // height viene en decímetros y weight en hectogramos: dividimos entre 10
    height: row.height / 10,
    weight: row.weight / 10,
    types,
    stats,
    image:
      row.sprites?.other?.['official-artwork']?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${row.id}.png`,
  };
};

// Concepto visto en clase: Consumo de API REST con fetch y async/await (Lista paginada)
export const getPokemonList = async (limit = 20, offset = 0, signal) => {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    { signal }
  );

  // Revisamos response.ok antes de llamar a response.json()
  if (!response.ok) {
    throw new Error('Error al obtener la lista de Pokémon');
  }

  const data = await response.json();
  return data.results.map(mapPokemonListItem);
};

// Concepto visto en clase: Búsqueda por nombre o ID y manejo de error 404
export const getPokemonByNameOrId = async (query, signal) => {
  // Los nombres deben ir en minúsculas y sin espacios al inicio o al final
  const cleanQuery = String(query).trim().toLowerCase();

  const response = await fetch(`${BASE_URL}/pokemon/${cleanQuery}`, {
    signal,
  });

  // Si el nombre no existe, la API responde 404 con texto plano, no JSON
  if (response.status === 404) {
    return null; // Retornamos null para indicar estado "Sin resultados"
  }

  if (!response.ok) {
    throw new Error('Error de red al consultar la API');
  }

  const data = await response.json();
  return mapPokemonDetail(data);
};