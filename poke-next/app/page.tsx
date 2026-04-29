// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getPokemonList, getPokemonIdFromUrl, getPokemonDetail } from "@/lib/pokeapi";
import SearchBar from "@/components/SearchBar";

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string; query?: string }> }) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const searchQuery = resolvedParams?.query;
  const limit = 20;
  const offset = (currentPage - 1) * limit;

  // Variables para almacenar los resultados
  let pokemonResults: { name: string; url: string }[] = [];
  let hasNextPage = false;
  let notFoundError = false;

  if (searchQuery) {
    // Modo Búsqueda: Intentamos buscar un Pokémon específico por nombre o ID
    try {
      const pokemon = await getPokemonDetail(searchQuery);
      // Lo empaquetamos en un array con el mismo formato que la lista normal
      // para poder reutilizar el componente del Grid
      pokemonResults = [
        {
          name: pokemon.name,
          url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
        }
      ];
    } catch (error) {
      notFoundError = true;
    }
  } else {
    // Modo Lista Normal: Traemos la paginación
    const data = await getPokemonList(limit, offset);
    pokemonResults = data.results;
    hasNextPage = !!data.next;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">
            Poké<span className="text-blue-600">Dex</span>
          </h1>
          <p className="text-slate-500 font-medium">Explora el mundo Pokémon con tecnología Next.js 15</p>
        </header>

        {/* 1. Agregamos el componente SearchBar */}
        <SearchBar />

        {/* 2. Manejo de error si no se encuentra el Pokémon */}
        {notFoundError && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">No pudimos encontrar a "{searchQuery}"</h2>
            <p className="text-slate-500 mb-8">Asegúrate de escribir el nombre o número correctamente.</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors">
              Ver todos los Pokémon
            </Link>
          </div>
        )}

        {/* 3. Grid de resultados */}
        {!notFoundError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {pokemonResults.map((pokemon) => {
              const id = getPokemonIdFromUrl(pokemon.url);
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

              return (
                <Link href={`/pokemon/${id}`} key={id} className="group">
                  <div className="relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 overflow-hidden h-full flex flex-col justify-between">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors duration-500" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="self-end text-slate-300 font-bold text-lg">#{id.padStart(3, '0')}</span>
                      <div className="relative w-40 h-40">
                        <Image
                          src={imageUrl}
                          alt={pokemon.name}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <h2 className="mt-4 text-2xl font-bold capitalize text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors text-center">
                        {pokemon.name}
                      </h2>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* 4. Paginación (solo se muestra si no estamos en modo búsqueda y hay resultados) */}
        {!searchQuery && !notFoundError && (
          <nav className="flex justify-center items-center gap-6 mt-16">
            {currentPage > 1 && (
              <Link href={`/?page=${currentPage - 1}`} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full font-bold shadow-md hover:bg-slate-900 hover:text-white transition-all active:scale-95 border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Anterior
              </Link>
            )}
            <span className="font-black text-slate-400 bg-slate-200 w-10 h-10 flex items-center justify-center rounded-full text-sm">
              {currentPage}
            </span>
            {hasNextPage && (
              <Link href={`/?page=${currentPage + 1}`} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full font-bold shadow-md hover:bg-slate-900 hover:text-white transition-all active:scale-95 border border-slate-100">
                Siguiente
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            )}
          </nav>
        )}
        
        {/* Botón para limpiar búsqueda */}
        {searchQuery && !notFoundError && (
          <div className="flex justify-center mt-12">
             <Link href="/" className="px-6 py-3 bg-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-300 transition-colors">
              Volver a la lista completa
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}