// app/items/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getItemDetail } from "@/lib/pokeapi";

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await getItemDetail(resolvedParams.id);

  // Extraemos la descripción completa (efecto detallado)
  const effectEntry = item.effect_entries?.find((e: any) => e.language.name === "en");
  const effectText = effectEntry?.effect || "No hay un efecto detallado para este objeto.";

  // Extraemos el texto de ambientación (Flavor text) de los juegos
  const flavorEntry = item.flavor_text_entries?.find((e: any) => e.language.name === "en");
  const flavorText = flavorEntry?.text.replace(/\n|\f/g, ' ') || "Sin descripción de juego.";

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Botón de volver */}
        <Link href="/items" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Volver a Objetos
        </Link>

        {/* Tarjeta Principal */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-8">
          
          {/* Cabecera del Objeto */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-10 md:p-14 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
            {/* Decoración circular de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Sprite en grande */}
            <div className="relative z-10 w-40 h-40 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center p-6 shadow-2xl">
              {item.sprites?.default ? (
                <Image 
                  src={item.sprites.default} 
                  alt={item.name} 
                  width={96} 
                  height={96}
                  className="object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                  style={{ imageRendering: 'pixelated' }} // Mantiene el estilo retro
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full" />
              )}
            </div>

            {/* Título y Categoría */}
            <div className="relative z-10 text-center md:text-left flex-1">
              <span className="inline-block px-4 py-1 bg-white/20 text-blue-100 rounded-full text-sm font-black tracking-widest uppercase mb-4">
                {item.category?.name.replace(/-/g, ' ')}
              </span>
              <h1 className="text-5xl md:text-6xl font-black capitalize tracking-tight drop-shadow-md mb-4">
                {item.name.replace(/-/g, ' ')}
              </h1>
              <p className="text-slate-300 font-medium italic text-lg leading-relaxed">
                "{flavorText}"
              </p>
            </div>
          </div>

          {/* Cuerpo de la Tarjeta */}
          <div className="p-10 md:p-14">
            
            {/* Grid de Stats (Costo y Atributos) */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              
              {/* Costo */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Valor en Tienda</p>
                <div className="text-5xl font-black text-slate-800 flex items-center gap-2">
                  {item.cost > 0 ? (
                    <>
                      <span className="text-blue-500 text-4xl">₽</span>
                      {item.cost.toLocaleString()}
                    </>
                  ) : (
                    <span className="text-3xl text-slate-400">No tiene precio</span>
                  )}
                </div>
              </div>

              {/* Atributos (Píldoras) */}
              <div className="flex-1">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Atributos del Objeto</h3>
                {item.attributes?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.attributes.map((attr: any) => (
                      <span key={attr.name} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100 capitalize">
                        {attr.name.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No hay atributos especiales.</p>
                )}
              </div>
            </div>

            {/* Efecto Técnico del Objeto */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
                Efecto Técnico
                <div className="h-1 flex-1 bg-slate-100 rounded-full" />
              </h2>
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-slate-700 leading-relaxed text-lg">
                {effectText}
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}