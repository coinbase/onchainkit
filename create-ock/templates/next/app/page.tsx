'use client';

import { WalletDefault } from '@coinbase/onchainkit/wallet';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="pt-4 pr-4">
        <div className="flex justify-end">
          <div className="wallet-container">
            <WalletDefault />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full p-4">
          {/* Add your components here */}
        </div>
      </main>

      <footer>
        <div className="container mx-auto text-center">
          <p>Built with OnchainKit</p>
        </div>
      </footer>
    </div>
  );
}
