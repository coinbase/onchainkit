import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import '@coinbase/onchainkit/styles.css';
import MintProviders from './MintProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coinbase Quarterly Earnings',
};

export default function MintLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MintProviders>{children}</MintProviders>
      </body>
    </html>
  );
}
