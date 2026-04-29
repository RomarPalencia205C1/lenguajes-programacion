// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Pokédex", href: "/" },
  { name: "Regiones", href: "/regions" },
  { name: "Movimientos", href: "/moves" },
  { name: "Objetos", href: "/items" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-100 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
               <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                 <div className="w-4 h-4 bg-blue-600 rounded-full" />
               </div>
            </div>
            <span className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
              Poké<span className="text-blue-600">Dex</span>
            </span>
          </Link>

          {/* Enlaces de Navegación Desktop */}
          <div className="hidden md:flex items-center gap-8 bg-slate-50/50 px-6 py-2 rounded-full border border-slate-100">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-widest transition-all ${
                    isActive 
                      ? "text-blue-600 scale-105 drop-shadow-sm" 
                      : "text-slate-400 hover:text-slate-900 hover:scale-105"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
}