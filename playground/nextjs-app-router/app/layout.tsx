import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import OnchainProviders from "@/components/OnchainProviders";
import '@coinbase/onchainkit/styles.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OnchainKit Demo"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OnchainProviders>
          {children}
        </OnchainProviders>
      </body>
    </html>
  );
}
