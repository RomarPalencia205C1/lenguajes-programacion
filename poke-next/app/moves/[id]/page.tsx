// app/moves/[id]/page.tsx
import Link from "next/link";
import { getMoveDetail } from "@/lib/pokeapi";
import { typeColorMap } from "@/lib/colors";

export default async function MoveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  // Buscamos el movimiento usando el parámetro de la URL
  const move = await getMoveDetail(resolvedParams.id);
  
  // Asignamos el tema de color basado en su tipo
  const theme = typeColorMap[move.type.name] || typeColorMap.normal;

  // Extraemos la descripción del efecto (buscamos la versión en inglés)
  const effectEntry = move.effect_entries?.find((entry: any) => entry.language.name === "en");
  // La API usa $effect_chance como variable en el texto, la reemplazamos por el número real
  const effectText = effectEntry 
    ? effectEntry.effect.replace("$effect_chance", move.effect_chance?.toString() || "") 
    : "No hay descripción disponible para este movimiento.";

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Botón de volver */}
        <Link href="/moves" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Volver a Movimientos
        </Link>

        {/* Tarjeta Principal */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-8">
          
          {/* Cabecera Temática */}
          <div className={`${theme.medium} p-10 md:p-14 text-white relative overflow-hidden`}>
            {/* Decoración */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-black tracking-widest uppercase mb-4 shadow-sm">
                  Clase: {move.damage_class?.name || 'Desconocida'}
                </span>
                <h1 className="text-5xl md:text-6xl font-black capitalize tracking-tight drop-shadow-md">
                  {move.name.replace(/-/g, ' ')}
                </h1>
              </div>
              
              <div className="bg-white text-slate-900 px-6 py-2 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${theme.medium}`} />
                {move.type.name}
              </div>
            </div>
          </div>

          {/* Cuerpo de la Tarjeta */}
          <div className="p-10 md:p-14">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Poder Base</p>
                <p className="text-4xl font-black text-slate-800">{move.power || '--'}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Precisión</p>
                <p className="text-4xl font-black text-slate-800">{move.accuracy ? `${move.accuracy}%` : '--'}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Puntos (PP)</p>
                <p className="text-4xl font-black text-slate-800">{move.pp || '--'}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Prioridad</p>
                <p className="text-4xl font-black text-slate-800">{move.priority}</p>
              </div>
            </div>

            {/* Efecto del Movimiento */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
                Efecto del Movimiento
                <div className="h-1 flex-1 bg-slate-100 rounded-full" />
              </h2>
              <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 text-slate-700 leading-relaxed text-lg">
                {effectText}
              </div>
            </div>

            {/* Detalles Adicionales */}
            <div className="mt-12 flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold border border-slate-200">
                Objetivo: <span className="capitalize">{move.target?.name.replace(/-/g, ' ')}</span>
              </span>
              <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold border border-slate-200">
                Introducido en: <span className="uppercase">{move.generation?.name.split('-')[1]}</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}