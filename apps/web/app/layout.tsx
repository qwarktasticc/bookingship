import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BookingShip',
  description: 'Yacht & boat marketplace for full charters and shared seats',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
