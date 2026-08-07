import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'El Canon de Occidente',
  description: 'Plataforma semántica para explorar la civilización occidental',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
