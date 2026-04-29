// lib/types.ts

// Respuesta al pedir la lista de Pokémon
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

// Cada item de la lista (solo trae nombre y la URL con sus detalles)
export interface PokemonListItem {
  name: string;
  url: string;
}

// Respuesta al pedir el detalle de un Pokémon específico
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}