// app/regions/[id]/page.tsx
import Link from "next/link";
import { getRegionDetail } from "@/lib/pokeapi";

export default async function RegionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const region = await getRegionDetail(resolvedParams.id);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Botón de volver */}
        <Link href="/regions" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Volver a Regiones
        </Link>

        {/* Cabecera de la Región */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 mb-8 relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-black tracking-widest uppercase mb-4">
                Generación Principal: {region.main_generation.name.split('-')[1]}
              </span>
              <h1 className="text-5xl md:text-6xl font-black capitalize text-slate-900 tracking-tight">
                {region.name}
              </h1>
            </div>
            
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        </div>

        {/* Lista de Localizaciones (Ciudades y Rutas) */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black text-slate-900">Ubicaciones Conocidas</h2>
            <div className="h-1 flex-1 bg-slate-200 rounded-full" />
            <span className="text-slate-500 font-bold">{region.locations.length} lugares</span>
          </div>

          {region.locations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {region.locations.map((location: { name: string; url: string }) => (
                <div key={location.name} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all group cursor-default">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <span className="font-bold text-slate-700 capitalize group-hover:text-blue-600 transition-colors">
                    {location.name.replace(/-/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic text-center py-8">No hay ubicaciones registradas para esta región.</p>
          )}
        </section>

      </div>
    </main>
  );
}