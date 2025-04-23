export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c6ffd9] to-white px-6 py-12 sm:px-20 sm:py-20 flex items-center justify-center">
      <main className="w-full max-w-3xl flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl sm:text-7xl font-bold text-gray-700">GastroStock</h1>
        <p className="text-base sm:text-lg text-gray-700 px-2 sm:px-0">
          Tu herramienta confiable para gestionar de forma eficiente el inventario de tu cafetería o restaurante. Aquí podrás controlar tus productos, recibir alertas de stock mínimo, registrar proveedores y generar reportes clave para tomar decisiones inteligentes.
        </p>
        <button
          type="submit"
          className="rounded-full bg-emerald-600 py-3 px-6 text-lg sm:text-xl font-medium text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <a 
          href="/login">
          ¡INGRESA AHORA!
          </a>
        </button>
      </main>
    </div>
  );
}
