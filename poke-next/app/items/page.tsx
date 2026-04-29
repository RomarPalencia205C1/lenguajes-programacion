// app/items/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getItemList, getItemDetail } from "@/lib/pokeapi";
import SearchBar from "@/components/SearchBar";

export default async function ItemsPage({ searchParams }: { searchParams: Promise<{ page?: string; query?: string }> }) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const searchQuery = resolvedParams?.query;
  const limit = 24; 
  const offset = (currentPage - 1) * limit;

  let itemsDetails: any[] = [];
  let hasNextPage = false;
  let notFoundError = false;

  if (searchQuery) {
    try {
      const item = await getItemDetail(searchQuery);
      itemsDetails = [item];
    } catch (error) {
      notFoundError = true;
    }
  } else {
    const listData = await getItemList(limit, offset);
    itemsDetails = await Promise.all(
      listData.results.map((item: { name: string }) => getItemDetail(item.name))
    );
    hasNextPage = !!listData.next;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
            Objetos <span className="text-blue-600 font-light">Pokémon</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Inventario completo: desde Poké Balls y pociones hasta objetos clave y bayas.
          </p>
        </header>

        {/* ¡BARRA DE BÚSQUEDA PARA OBJETOS! */}
        <SearchBar 
          apiEndpoint="item" 
          baseRoute="/items" 
          placeholder="Busca un objeto (ej: master-ball, potion)..." 
        />

        {notFoundError && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">No pudimos encontrar "{searchQuery}"</h2>
            <Link href="/items" className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors">
              Ver todos los objetos
            </Link>
          </div>
        )}

        {!notFoundError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {itemsDetails.map((item) => {
              const effectEntry = item.effect_entries?.find((e: any) => e.language.name === "en");
              const shortEffect = effectEntry?.short_effect || "Sin descripción disponible.";

              return (
                <Link href={`/items/${item.name}`} key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 group-hover:bg-blue-50 transition-colors" />
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                      {item.sprites?.default ? (
                        <Image src={item.sprites.default} alt={item.name} width={40} height={40} className="object-contain drop-shadow-md" />
                      ) : (
                        <div className="w-8 h-8 bg-slate-200 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-black capitalize text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                        {item.name.replace(/-/g, ' ')}
                      </h2>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {item.category?.name.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1">{shortEffect}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Costo</span>
                    <div className="flex items-center gap-1 font-black text-slate-700">
                      {item.cost > 0 ? <><span className="text-blue-500">₽</span>{item.cost.toLocaleString()}</> : <span className="text-slate-400 text-sm">No vendible</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!searchQuery && !notFoundError && (
          <nav className="flex justify-center items-center gap-6">
            {currentPage > 1 && (
              <Link href={`/items?page=${currentPage - 1}`} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full font-bold shadow-md hover:bg-slate-900 hover:text-white transition-all active:scale-95 border border-slate-100"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>Anterior</Link>
            )}
            <span className="font-black text-slate-400 bg-slate-200 w-10 h-10 flex items-center justify-center rounded-full text-sm">{currentPage}</span>
            {hasNextPage && (
              <Link href={`/items?page=${currentPage + 1}`} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full font-bold shadow-md hover:bg-slate-900 hover:text-white transition-all active:scale-95 border border-slate-100">Siguiente<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></Link>
            )}
          </nav>
        )}

        {searchQuery && !notFoundError && (
          <div className="flex justify-center mt-12">
            <Link href="/items" className="px-6 py-3 bg-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-300 transition-colors">Volver a todos los objetos</Link>
          </div>
        )}

      </div>
    </main>
  );
}