'use client';
import { AppContext, OnchainKitComponent } from '@/components/AppProvider';
import { Chain } from '@/components/form/chain';
import { ComponentMode } from '@/components/form/component-mode';
import { PaymasterUrl } from '@/components/form/paymaster';
import { SwapConfig } from '@/components/form/swap-config';
import { WalletType } from '@/components/form/wallet-type';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import ComponentThemeSelector from './ui/component-theme-selector';
import FundDemo from './demo/Fund';
import IdentityDemo from './demo/Identity';
import SwapDemo from './demo/Swap';
import SwapDefaultDemo from './demo/SwapDefault';
import TransactionDemo from './demo/Transaction';
import TransactionDefaultDemo from './demo/TransactionDefault';
import WalletDemo from './demo/Wallet';
import WalletDefaultDemo from './demo/WalletDefault';
import { ActiveComponent } from './form/active-component';
import { TransactionOptions } from './form/transaction-options';

function Demo() {
  const { activeComponent } = useContext(AppContext);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    console.log('Playground.activeComponent:', activeComponent);
  }, [activeComponent]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.style.transition =
      'background-color 0.5s, color 0.5s';
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO: refactor
  function renderActiveComponent() {
    if (activeComponent === OnchainKitComponent.Fund) {
      return <FundDemo />;
    }

    if (activeComponent === OnchainKitComponent.Identity) {
      return <IdentityDemo />;
    }

    if (activeComponent === OnchainKitComponent.Transaction) {
      return <TransactionDemo />;
    }

    if (activeComponent === OnchainKitComponent.Swap) {
      return <SwapDemo />;
    }

    if (activeComponent === OnchainKitComponent.SwapDefault) {
      return <SwapDefaultDemo />;
    }

    if (activeComponent === OnchainKitComponent.Wallet) {
      return <WalletDemo />;
    }

    if (activeComponent === OnchainKitComponent.WalletDefault) {
      return <WalletDefaultDemo />;
    }

    if (activeComponent === OnchainKitComponent.TransactionDefault) {
      return <TransactionDefaultDemo />;
    }

    return <></>;
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-30">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="rounded-full border p-2 text-xl shadow-lg transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {isDarkMode ? (
            <Sun className="text-yellow-500" />
          ) : (
            <Moon className="text-blue-500" />
          )}
        </button>
      </div>
      <div
        className="flex w-96 flex-col rounded-2xl border bg-opacity-10 shadow-lg backdrop-blur-md transition-all"
        style={{
          backgroundColor: isDarkMode
            ? 'rgba(0, 0, 0, 0.5)'
            : 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <div className="flex justify-between p-3">
          <div className="font-semibold text-lg">OnchainKit Playground</div>
        </div>
        <form className="grid gap-4 p-4">
          <ActiveComponent />
          <ComponentMode />
          <WalletType />
          <Chain />
          <TransactionOptions />
          <PaymasterUrl />
          <SwapConfig />
        </form>
      </div>
      <div className="flex flex-1 flex-col bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px), bg-[size:6rem_4rem]">
        <div className="flex h-full w-full flex-col justify-center">
          {renderActiveComponent()}
        </div>
      </div>
      <div className="-translate-y-1/2 fixed top-1/2 right-0 transform">
        <ComponentThemeSelector />
      </div>
      <footer className="fixed bottom-4 left-4 flex w-full justify-start p-4 text-sm">
        <a
          className="opacity-100 transition-opacity duration-200 hover:opacity-70"
          href="https://github.com/coinbase/onchainkit/tree/main/playground"
          rel="noreferrer"
          target="_blank"
          title="View OnchainKit Playground on GitHub"
        >
          Github ↗
        </a>
        <a
          className="pl-4 opacity-100 transition-opacity duration-200 hover:opacity-70"
          href="https://onchainkit.xyz"
          rel="noreferrer"
          target="_blank"
          title="View OnchainKit"
        >
          OnchainKit ↗
        </a>
      </footer>
    </>
  );
}

export default Demo;
