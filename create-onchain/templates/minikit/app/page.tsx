'use client';

import { 
  useMiniKit, 
  useAddFrame, 
} from '@coinbase/onchainkit';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { useEffect } from 'react';
import Sammy from './components/Sammy';

export default function App() {
  const { ready, isReady, context } = useMiniKit();

  useEffect(() => {
    if (!isReady) {
      ready();
    }
  }, [ready, isReady]);

  const addFrame = useAddFrame();

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-black items-center">
      <div className="w-full max-w-[500px]">
        <header className="flex justify-between items-center">
          <div className="pt-4 pl-4 flex justify-start">
            {context && !context.client.added && (
              <button 
                type="button" 
                onClick={addFrame} 
              className="cursor-pointer ock-bg-secondary active:bg-[var(--ock-bg-secondary-active)] hover:bg-[var(--ock-bg-secondary-hover)] ock-border-radius ock-text-foreground px-4 py-3">
                <span className="ock-font-family font-semibold ock-text-foreground">
                  Add Frame
                </span>
              </button>
            )}
          </div>
          <div className="pt-4 pr-4 flex justify-end">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </header>

        <div className="mt-4 mx-[10px]">
          <Sammy />
        </div>
      </div>
    </div>
  );
}
