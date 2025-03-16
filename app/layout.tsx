import './globals.css';
import type { Metadata } from 'next';
import { Inter, Lexend_Zetta, Meow_Script } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const lexendZetta = Lexend_Zetta({ subsets: ['latin'], weight: ['400'] });
const meowScript = Meow_Script({ subsets: ['latin'], weight: ['400'] });

export const metadata: Metadata = {
  title: 'For my baby',
  description: 'I hope you like this as much as i liked making it',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}