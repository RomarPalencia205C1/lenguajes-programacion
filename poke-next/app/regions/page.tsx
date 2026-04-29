// app/regions/page.tsx
import Link from "next/link";
import { getRegionList, getIdFromUrl } from "@/lib/pokeapi";

export default async function RegionsPage() {
  const data = await getRegionList();

  // Sistema de colores robusto y 100% compatible con Tailwind
  const themes = [
    { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", iconBg: "bg-red-50" },
    { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", iconBg: "bg-blue-50" },
    { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", iconBg: "bg-green-50" },
    { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", iconBg: "bg-purple-50" },
    { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", iconBg: "bg-amber-50" },
    { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-200", iconBg: "bg-teal-50" },
    { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200", iconBg: "bg-pink-50" },
    { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200", iconBg: "bg-indigo-50" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
            Regiones <span className="text-blue-600 font-light">Pokémon</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Descubre los continentes y áreas geográficas donde habitan las diferentes generaciones de Pokémon.
          </p>
        </header>

        {/* Grid de Regiones Mejorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.results.map((region: { name: string; url: string }, index: number) => {
            const id = getIdFromUrl(region.url);
            const theme = themes[index % themes.length]; // Asigna un tema cíclico

            return (
              <Link href={`/regions/${id}`} key={id} className="group">
                <div className={`relative bg-white rounded-3xl p-6 shadow-sm border border-slate-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden flex flex-col justify-between h-52`}>
                  
                  {/* Círculo de color dinámico en el fondo (Efecto visual) */}
                  <div className={`absolute -bottom-16 -right-16 w-48 h-48 ${theme.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700`} />
                  
                  {/* Top: Generación e Icono */}
                  <div className="relative z-10 flex justify-between items-start">
                    <span className={`px-4 py-1.5 rounded-full ${theme.bg} ${theme.text} font-bold text-xs uppercase tracking-widest shadow-sm`}>
                      Gen {id}
                    </span>
                    
                    <div className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center ${theme.text} group-hover:scale-110 transition-transform`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                  </div>

                  {/* Nombre de la Región (¡Ahora muy visible!) */}
                  <div className="relative z-10 mt-auto">
                    <p className="text-slate-400 text-sm font-medium mb-1">Región de</p>
                    <h2 className="text-4xl font-black capitalize text-slate-800 tracking-tight group-hover:text-slate-900">
                      {region.name}
                    </h2>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}