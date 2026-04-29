// lib/colors.ts

export const typeColorMap: Record<string, { medium: string; light: string; text: string }> = {
  fire: { medium: "bg-orange-500", light: "bg-orange-100", text: "text-orange-700" },
  water: { medium: "bg-blue-500", light: "bg-blue-100", text: "text-blue-700" },
  grass: { medium: "bg-green-500", light: "bg-green-100", text: "text-green-700" },
  electric: { medium: "bg-yellow-400", light: "bg-yellow-100", text: "text-yellow-700" },
  ice: { medium: "bg-cyan-300", light: "bg-cyan-50", text: "text-cyan-700" },
  fighting: { medium: "bg-red-600", light: "bg-red-100", text: "text-red-700" },
  poison: { medium: "bg-purple-500", light: "bg-purple-100", text: "text-purple-700" },
  ground: { medium: "bg-amber-600", light: "bg-amber-100", text: "text-amber-700" },
  flying: { medium: "bg-indigo-400", light: "bg-indigo-50", text: "text-indigo-700" },
  psychic: { medium: "bg-pink-500", light: "bg-pink-100", text: "text-pink-700" },
  bug: { medium: "bg-lime-500", light: "bg-lime-100", text: "text-lime-700" },
  rock: { medium: "bg-stone-500", light: "bg-stone-100", text: "text-stone-700" },
  ghost: { medium: "bg-violet-700", light: "bg-violet-100", text: "text-violet-700" },
  dragon: { medium: "bg-indigo-700", light: "bg-indigo-100", text: "text-indigo-700" },
  dark: { medium: "bg-zinc-800", light: "bg-zinc-200", text: "text-zinc-800" },
  steel: { medium: "bg-slate-400", light: "bg-slate-100", text: "text-slate-700" },
  fairy: { medium: "bg-rose-400", light: "bg-rose-100", text: "text-rose-700" },
  normal: { medium: "bg-gray-400", light: "bg-gray-100", text: "text-gray-700" },
};