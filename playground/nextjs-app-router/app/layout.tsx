import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import OnchainProviders from '@/components/OnchainProviders';
import './globals.css';
import '@coinbase/onchainkit/styles.css';

const dmSans = DM_Sans({ subsets: ['latin'] });

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
      <body className={`font-sans ${dmSans.className}`}>
        <OnchainProviders>{children}</OnchainProviders>
      </body>
    </html>
  );
}
