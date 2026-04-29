// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pokédex Premium Next.js",
  description: "Explora el mundo Pokémon, regiones, movimientos y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 antialiased`}>
        {/* Aquí insertamos nuestra barra de navegación global */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}