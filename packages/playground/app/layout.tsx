import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import OnchainProviders from '@/components/OnchainProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OnchainKit Playground',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OnchainProviders>{children}</OnchainProviders>
      </body>
    </html>
  );
}
