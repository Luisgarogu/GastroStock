// components/Navbar.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [logged, setLogged] = useState(false);

  // Lee localStorage solo en el cliente
  useEffect(() => {
    const check = () => setLogged(localStorage.getItem('auth') === 'true');
    check();

    // Escucha cambios desde otras pestañas
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  if (!logged) return null;              // oculto si no hay sesión

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between bg-white/80 backdrop-blur px-6 py-3 shadow">
      <h1 className="font-bold text-emerald-700">GastroStock</h1>

      <ul className="flex gap-6 text-sm font-medium text-gray-700">
        <li><Link href="/productos">Productos</Link></li>
        <li><Link href="/proovedores">Proovedores</Link></li>
        <li><Link href="/reportes">Reportes</Link></li>
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem('auth');   // “logout” rápido
          setLogged(false);
          location.href = '/';              // o router.push('/')
        }}
        className="rounded-full bg-emerald-600 px-4 py-1 text-white hover:bg-emerald-700"
      >
        Salir
      </button>
    </nav>
  );
}
