import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Appbar, Footer } from '@/components';
import type { Link } from '@/components';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arctura',
  description: 'A Next.js workspace app for the Arctura monorepo.',
};

const links: Link[] = [
  { href: '#docs', text: 'Docs' },
  { href: '#components', text: 'Components' },
  { href: '#patters', text: 'Patterns' },
  { href: '#Resources', text: 'Resources' },
  { href: '#Playground', text: 'Playground' },
  { href: '#Changelog', text: 'Changelog' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Appbar links={links} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
