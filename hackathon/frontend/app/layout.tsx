import './globals.css';
import { ReactQueryClientProvider } from '../src/lib/fetcher';

export const metadata = { title: 'DiagSafe', description: 'STRIDE on demand' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
      </body>
    </html>
  );
}
