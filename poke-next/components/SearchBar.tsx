// components/SearchBar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface BasicEntity {
  name: string;
  url: string;
}

interface SearchBarProps {
  apiEndpoint?: string; // "pokemon", "move", "item"
  baseRoute?: string;   // "/", "/moves", "/items"
  placeholder?: string; // Texto a mostrar
}

export default function SearchBar({
  apiEndpoint = "pokemon",
  baseRoute = "/",
  placeholder = "Busca por nombre..."
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [allItems, setAllItems] = useState<BasicEntity[]>([]);
  const [suggestions, setSuggestions] = useState<BasicEntity[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 1. Descargamos la lista maestra según el endpoint que nos pidan
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/${apiEndpoint}?limit=10000`);
        const data = await res.json();
        setAllItems(data.results);
      } catch (error) {
        console.error(`Error al cargar ${apiEndpoint} para autocompletar`, error);
      }
    };
    fetchAllData();
  }, [apiEndpoint]);

  // 2. Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Filtrar sugerencias
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      const filtered = allItems.filter((item) =>
        item.name.toLowerCase().startsWith(value.toLowerCase().trim())
      );
      setSuggestions(filtered.slice(0, 6)); 
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 4. Ejecutar la búsqueda en la ruta correspondiente
  const executeSearch = (searchTerm: string) => {
    setShowSuggestions(false);
    
    // Validamos la ruta base: si es "/" agregamos "?query=", si no "/moves?query="
    const url = new URL(baseRoute, window.location.origin);
    if (searchTerm.trim()) {
      url.searchParams.set("query", searchTerm.toLowerCase().trim());
    }
    
    router.push(url.pathname + url.search);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  return (
    <div ref={wrapperRef} className="w-full max-w-2xl mx-auto mb-12 relative z-50">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim().length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="block w-full p-4 pl-12 text-slate-900 border border-slate-200 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-lg"
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-6 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-blue-600 transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Menú de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-50">
          {suggestions.map((item) => (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => {
                  setQuery(item.name);
                  executeSearch(item.name);
                }}
                className="w-full text-left px-6 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span className="font-medium text-slate-700 capitalize text-lg">{item.name.replace(/-/g, ' ')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}