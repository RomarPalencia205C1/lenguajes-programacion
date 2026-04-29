// lib/pokeapi.ts
import { PokemonListResponse, PokemonDetail } from "./types";

const BASE_URL = "https://pokeapi.co/api/v2";

// Obtenemos los primeros 20 Pokémon
export async function getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  
  if (!res.ok) throw new Error("Error al obtener la lista de Pokémon");
  
  return res.json();
}

// Obtenemos el detalle por ID o Nombre
export async function getPokemonDetail(idOrName: string): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  
  if (!res.ok) throw new Error(`Error al obtener detalles del Pokémon: ${idOrName}`);
  
  return res.json();
}

// Función auxiliar para extraer el ID de la URL y formar la imagen para la lista principal
// La URL viene así: "https://pokeapi.co/api/v2/pokemon/1/" -> Extraemos el "1"
export function getPokemonIdFromUrl(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

// Añade esto al final de lib/pokeapi.ts

export async function getRegionList() {
  const res = await fetch(`${BASE_URL}/region`);
  
  if (!res.ok) throw new Error("Error al obtener la lista de regiones");
  
  return res.json();
}

// Extraemos el ID de la región de su URL (igual que hicimos con los Pokémon)
export function getIdFromUrl(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export async function getRegionDetail(id: string) {
  const res = await fetch(`${BASE_URL}/region/${id}`);
  
  if (!res.ok) throw new Error(`Error al obtener detalles de la región: ${id}`);
  
  return res.json();
}

// Obtener la lista paginada de movimientos
export async function getMoveList(limit = 20, offset = 0) {
  const res = await fetch(`${BASE_URL}/move?limit=${limit}&offset=${offset}`);
  
  if (!res.ok) throw new Error("Error al obtener la lista de movimientos");
  
  return res.json();
}

// Obtener el detalle de un movimiento específico (para ver su poder, tipo, etc.)
export async function getMoveDetail(idOrName: string) {
  const res = await fetch(`${BASE_URL}/move/${idOrName}`);
  
  if (!res.ok) throw new Error(`Error al obtener detalles del movimiento: ${idOrName}`);
  
  return res.json();
}

// Obtener la lista paginada de objetos
export async function getItemList(limit = 24, offset = 0) {
  const res = await fetch(`${BASE_URL}/item?limit=${limit}&offset=${offset}`);
  
  if (!res.ok) throw new Error("Error al obtener la lista de objetos");
  
  return res.json();
}

// Obtener el detalle de un objeto específico (para ver su imagen, precio y efecto)
export async function getItemDetail(idOrName: string) {
  const res = await fetch(`${BASE_URL}/item/${idOrName}`);
  
  if (!res.ok) throw new Error(`Error al obtener detalles del objeto: ${idOrName}`);
  
  return res.json();
}