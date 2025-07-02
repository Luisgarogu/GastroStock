import './globals.css';
import { Navbar } from './components/Navbar';
import QueryProvider from './QueryProvider'; // si ya lo tenías

export const metadata = { title: 'GastroStock' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>
          <Navbar />    
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
