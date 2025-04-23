"use client";

export default function Registro() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#c6ffd9] to-white">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src="/images/login/GastroStockIcon.webp" alt="Xendre" className="h-30 w-auto" />
          <h1 className="mt-4 text-2xl font-semibold tracking-wide text-gray-800">
            GastroStock - Registro de Usuario
          </h1>
        </div>

        {/* Formulario */}
        <form className="space-y-6">
          {/* Usuario */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 14a4 4 0 00-8 0m8 0a4 4 0 01-8 0m8 0v1a6 6 0 01-12 0v-1m12 1v1a6 6 0 01-12 0v-1"
              />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              placeholder="Usuario"
              className="text-gray-800 w-full rounded-lg border border-gray-300 bg-white/60 py-3 pl-11 pr-4 text-sm placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m6-6V9a6 6 0 10-12 0v2m-2 0h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9z"
              />
            </svg>
            <input
              type="password"
              placeholder="Contraseña"
              className="text-gray-800 w-full rounded-lg border border-gray-300 bg-white/60 py-3 pl-11 pr-4 text-sm placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m6-6V9a6 6 0 10-12 0v2m-2 0h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9z"
              />
            </svg>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="text-gray-800 w-full rounded-lg border border-gray-300 bg-white/60 py-3 pl-11 pr-4 text-sm placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              className="flex-1 rounded-full bg-emerald-600 py-3 text-sm font-medium text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Registrarse
            </button>
            <a
              href="/login"
              className="flex-1 rounded-full border border-emerald-600 py-3 text-center text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
            >
              Volver a Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
