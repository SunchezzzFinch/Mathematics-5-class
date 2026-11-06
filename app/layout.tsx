import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ИИ-Репетитор 5 класс: Математика',
  description: 'Персональный интерактивный ИИ-репетитор по математике 5 класса на базе УМК Виленкина и Ткачёвой с обучением через Minecraft, Космос и Музыку, сократическим методом и кабинетом родителя.',
  openGraph: {
    title: 'ИИ-Репетитор 5 класс: Математика',
    description: 'Персональный интерактивный ИИ-репетитор по математике 5 класса на базе УМК Виленкина и Ткачёвой.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ИИ-Репетитор 5 класс: Математика',
    description: 'Персональный интерактивный ИИ-репетитор по математике 5 класса на базе УМК Виленкина и Ткачёвой.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

