'use client';
import { useContext, useEffect, useState } from 'react';
import { AppContext, OnchainKitComponent } from '@/components/AppProvider';
import { Chain } from '@/components/form/chain';
import { PaymasterUrl } from '@/components/form/paymaster';
import { SwapConfig } from '@/components/form/swap-config';
import { WalletType } from '@/components/form/wallet-type';
import IdentityDemo from './demo/Identity';
import SwapDemo from './demo/Swap';
import TransactionDemo from './demo/Transaction';
import WalletDemo from './demo/Wallet';
import { ActiveComponent } from './form/active-component';
import { TransactionOptions } from './form/transaction-options';
import DefaultDemo from './DefaultDemo';
import clsx from 'clsx';

// Define the type for the props of the Sidebar component
interface SidebarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Component for Sidebar containing form and dark mode toggle
function Sidebar({ isDarkMode, toggleDarkMode }: SidebarProps) {
  return (
    <div className="hidden w-1/4 min-w-120 flex-col border-r bg-background p-6 sm:flex">
      {/* Playground title */}
      <div className="mb-12 font-semibold text-xl">OnchainKit Playground</div>
      {/* Dark Mode Toggle Button */}
      <button
        type="button"
        onClick={toggleDarkMode}
        className={clsx(
          'rounded border px-3 py-2 transition-colors',
          isDarkMode
            ? 'border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
            : 'border-gray-300 bg-white text-black hover:bg-gray-100'
        )}
      >
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      {/* Form for configuring the Playground */}
      <form className="mt-4 grid gap-8">
        <ActiveComponent />
        <WalletType />
        <Chain />
        <TransactionOptions />
        <PaymasterUrl />
        <SwapConfig />
      </form>
      {/* External Links */}
      <ExternalLinks />
    </div>
  );
}

// Component for external links
function ExternalLinks() {
  return (
    <>
      <a
        target="_blank"
        className="absolute bottom-6 left-6 text-sm hover:underline"
        href="https://github.com/coinbase/onchainkit/tree/main/playground"
        rel="noreferrer"
        title="View OnchainKit Playground on GitHub"
      >
        Github ↗
      </a>
      <a
        target="_blank"
        className="absolute bottom-6 left-[100px] text-sm hover:underline"
        href="https://onchainkit.xyz"
        rel="noreferrer"
        title="View OnchainKit"
      >
        OnchainKit ↗
      </a>
    </>
  );
}

// Props for DemoComponent
interface DemoComponentProps {
  activeComponent: OnchainKitComponent;
}

// Component for rendering the active demo component based on the activeComponent value
function DemoComponent({ activeComponent }: DemoComponentProps) {
  switch (activeComponent) {
    case OnchainKitComponent.Identity:
      return <IdentityDemo />;
    case OnchainKitComponent.Transaction:
      return <TransactionDemo />;
    case OnchainKitComponent.Swap:
      return <SwapDemo />;
    case OnchainKitComponent.Wallet:
      return <WalletDemo />;
    default:
      return <IdentityDemo />;
  }
}

// Main Demo component
function Demo() {
  
  const { activeComponent } = useContext(AppContext);
  
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  
  useEffect(() => {
    if (activeComponent !== undefined) {
      console.log('Playground.activeComponent:', activeComponent);
    }
  }, [activeComponent]);

  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      {/* Sidebar containing the playground form and configuration */}
      <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      {/* Main content area displaying the selected demo */}
      <div className="linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] flex flex-1 flex-col bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px), bg-[size:6rem_4rem]">
        <div className="flex h-full w-full flex-col justify-center">
          {/* Render the active demo component only if it's defined  else show default doc demo */}
          {activeComponent ? <DemoComponent activeComponent={activeComponent} /> : <DefaultDemo />}
        </div>
      </div>
    </>
  );
}

export default Demo;
