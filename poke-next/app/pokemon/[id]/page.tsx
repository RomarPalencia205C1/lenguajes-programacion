import Image from "next/image";
import Link from "next/link";
import { getPokemonDetail } from "@/lib/pokeapi";
import { typeColorMap } from "@/lib/colors";

export default async function PokemonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const pokemon = await getPokemonDetail(resolvedParams.id);
  const mainType = pokemon.types[0].type.name;
  const theme = typeColorMap[mainType] || typeColorMap.normal;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section Dinámica */}
      <div className={`relative h-[40vh] md:h-[50vh] ${theme.medium} overflow-hidden flex items-center justify-center`}>
        <Link href="/" className="absolute top-8 left-8 z-20 bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </Link>
        
        {/* Marca de agua de texto */}
        <h1 className="absolute text-[15vw] font-black text-white/10 uppercase select-none">
          {pokemon.name}
        </h1>

        <div className="relative w-64 h-64 md:w-80 md:h-80 z-10 drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)]">
          <Image
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="relative -mt-12 bg-white rounded-t-[3rem] p-8 md:p-16 max-w-5xl mx-auto shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h2 className="text-5xl font-black capitalize text-slate-900 tracking-tight">
              {pokemon.name} <span className="text-slate-300 font-light">#{pokemon.id}</span>
            </h2>
            <div className="flex gap-3 mt-4">
              {pokemon.types.map((t) => {
                const tTheme = typeColorMap[t.type.name] || typeColorMap.normal;
                return (
                  <span key={t.type.name} className={`${tTheme.medium} text-white px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg`}>
                    {t.type.name}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className="flex gap-12 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="text-center">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Peso</p>
              <p className="text-2xl font-black text-slate-800">{pokemon.weight / 10} <span className="text-sm font-normal">kg</span></p>
            </div>
            <div className="text-center border-l border-slate-200 pl-12">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Altura</p>
              <p className="text-2xl font-black text-slate-800">{pokemon.height / 10} <span className="text-sm font-normal">m</span></p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section>
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
            Base Stats
            <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name} className="flex flex-col">
                <div className="flex justify-between mb-2">
                  <span className="uppercase text-xs font-black text-slate-500 tracking-widest">{stat.stat.name.replace('-', ' ')}</span>
                  <span className="font-bold text-slate-900">{stat.base_stat}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${theme.medium} rounded-full transition-all duration-1000 ease-out origin-left`}
                    style={{ width: `${(stat.base_stat / 200) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}