// app/moves/page.tsx
import Link from "next/link";
import { getMoveList, getMoveDetail } from "@/lib/pokeapi";
import { typeColorMap } from "@/lib/colors";
import SearchBar from "@/components/SearchBar";

export default async function MovesPage({ searchParams }: { searchParams: Promise<{ page?: string; query?: string }> }) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const searchQuery = resolvedParams?.query;
  const limit = 24; 
  const offset = (currentPage - 1) * limit;

  let movesDetails: any[] = [];
  let hasNextPage = false;
  let notFoundError = false;

  if (searchQuery) {
    try {
      // Modo búsqueda: Intentamos traer solo ese movimiento
      const move = await getMoveDetail(searchQuery);
      movesDetails = [move];
    } catch (error) {
      notFoundError = true;
    }
  } else {
    // Modo normal: Traemos la lista paginada
    const listData = await getMoveList(limit, offset);
    movesDetails = await Promise.all(
      listData.results.map((move: { name: string }) => getMoveDetail(move.name))
    );
    hasNextPage = !!listData.next;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
            Movimientos <span className="text-blue-600 font-light">Pokémon</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Explora el arsenal de ataques, defensas y efectos de estado.
          </p>
        </header>

        {/* ¡NUESTRA BARRA DE BÚSQUEDA REUTILIZADA! */}
        <SearchBar 
          apiEndpoint="move" 
          baseRoute="/moves" 
          placeholder="Busca un movimiento (ej: tackle, surf)..." 
        />

        {/* Mensaje de Error si no se encuentra */}
        {notFoundError && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">No pudimos encontrar "{searchQuery}"</h2>
            <Link href="/moves" className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors">
              Ver todos los movimientos
            </Link>
          </div>
        )}

        {/* Grid de Movimientos */}
        {!notFoundError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {movesDetails.map((move) => {
              const theme = typeColorMap[move.type.name] || typeColorMap.normal;

              return (
                <Link href={`/moves/${move.name}`} key={move.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-black capitalize text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                      {move.name.replace(/-/g, ' ')}
                    </h2>
                    <span className={`${theme.medium} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm`}>
                      {move.type.name}
                    </span>
                  </div>
                  <div className="mb-6 flex-1">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold capitalize">
                      Clase: {move.damage_class?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-auto">
                    <div className="text-center">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Poder</p>
                      <p className="text-lg font-black text-slate-800">{move.power || '--'}</p>
                    </div>
                    <div className="text-center border-l border-slate-200">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Prec</p>
                      <p className="text-lg font-black text-slate-800">{move.accuracy || '--'}</p>
                    </div>
                    <div className="text-center border-l border-slate-200">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">PP</p>
                      <p className="text-lg font-black text-slate-800">{move.pp || '--'}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Paginación y Botón Limpiar */}
        {!searchQuery && !notFoundError && (
          <nav className="flex justify-center items-center gap-6">
            {currentPage > 1 && (
              <Link href={`/moves?page=${currentPage - 1}`} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full font-bold shadow-md hover:bg-slate-900 hover:text-white transition-all active:scale-95 border border-slate-100"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>Anterior</Link>
            )}
            <span className="font-black text-slate-400 bg-slate-200 w-10 h-10 flex items-center justify-center rounded-full text-sm">{currentPage}</span>
            {hasNextPage && (
              <Link href={`/moves?page=${currentPage + 1}`} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full font-bold shadow-md hover:bg-slate-900 hover:text-white transition-all active:scale-95 border border-slate-100">Siguiente<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></Link>
            )}
          </nav>
        )}
        
        {searchQuery && !notFoundError && (
          <div className="flex justify-center mt-12">
            <Link href="/moves" className="px-6 py-3 bg-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-300 transition-colors">Volver a todos los movimientos</Link>
          </div>
        )}

      </div>
    </main>
  );
}