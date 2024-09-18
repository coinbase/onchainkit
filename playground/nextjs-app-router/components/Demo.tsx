'use client';
import { AppContext, OnchainKitComponent } from '@/components/AppProvider';
import { Chain } from '@/components/form/chain';
import { PaymasterUrl } from '@/components/form/paymaster';
import { SwapConfig } from '@/components/form/swap-config';
import { WalletType } from '@/components/form/wallet-type';
import { useContext, useEffect, useState } from 'react';
import IdentityDemo from './demo/Identity';
import SwapDemo from './demo/Swap';
import TransactionDemo from './demo/Transaction';
import WalletDemo from './demo/Wallet';
import { ActiveComponent } from './form/active-component';
import { TransactionOptions } from './form/transaction-options';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
function Demo() {
  const { activeComponent } = useContext(AppContext);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    console.log('Playground.activeComponent:', activeComponent);
  }, [activeComponent]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <div className="hidden w-1/4 min-w-120 flex-col border-r bg-background p-6 sm:flex">
        <div className="mb-12 font-semibold text-lg">OnchainKit Playground</div>
        <button
          type="button"
          onClick={toggleDarkMode}
          className={`rounded border px-3 py-2 transition-colors ${
            isDarkMode
              ? 'border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
              : 'border-gray-300 bg-white text-black hover:bg-gray-100'
          }`}
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
        <form className="mt-4 grid gap-8">
          <ActiveComponent />
          <WalletType />
          <Chain />
          <TransactionOptions />
          <PaymasterUrl />
          <SwapConfig />
        </form>
        <a
          target="_blank"
          className="absolute bottom-6 left-6 text-sm hover:underline"
          href="https://github.com/coinbase/onchainkit/tree/main/playground"
          rel="noreferrer"
          title="View OnchainKit Playground on GitHub"
        >
          View Github
        </a>
      </div>
      <div className="linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] flex flex-1 flex-col bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px), bg-[size:6rem_4rem]">
        <div className="flex h-full w-full flex-col justify-center">
          {activeComponent === OnchainKitComponent.Identity ? (
            <IdentityDemo />
          ) : activeComponent === OnchainKitComponent.Transaction ? (
            <TransactionDemo />
          ) : activeComponent === OnchainKitComponent.Swap ? (
            <SwapDemo />
          ) : activeComponent === OnchainKitComponent.Wallet ? (
            <WalletDemo />
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default Demo;
