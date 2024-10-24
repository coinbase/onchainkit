'use client';
import { AppContext, OnchainKitComponent } from '@/components/AppProvider';
import { useContext, useEffect, useState } from 'react';
import DemoOptions from './DemoOptions';
import CheckoutDemo from './demo/Checkout';
import FundDemo from './demo/Fund';
import IdentityDemo from './demo/Identity';
import NFTCardDemo from './demo/NFTCard';
import NFTMintCardDemo from './demo/NFTMintCard';
import SwapDemo from './demo/Swap';
import SwapDefaultDemo from './demo/SwapDefault';
import TransactionDemo from './demo/Transaction';
import TransactionDefaultDemo from './demo/TransactionDefault';
import WalletDemo from './demo/Wallet';
import WalletDefaultDemo from './demo/WalletDefault';

function Demo() {
  const { activeComponent } = useContext(AppContext);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sideBarVisible, setSideBarVisible] = useState(true);

  useEffect(() => {
    console.log('Playground.activeComponent:', activeComponent);
  }, [activeComponent]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setSideBarVisible((visible) => !visible);
  };

  const buttonStyles = `rounded border px-3 py-2 transition-colors ${
    isDarkMode
      ? 'border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
      : 'border-gray-300 bg-white text-black hover:bg-gray-100'
  }`;

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

    if (activeComponent === OnchainKitComponent.Checkout) {
      return <CheckoutDemo />;
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

    if (activeComponent === OnchainKitComponent.NFTMintCard) {
      return <NFTMintCardDemo />;
    }

    if (activeComponent === OnchainKitComponent.NFTCard) {
      return <NFTCardDemo />;
    }

    return <></>;
  }

  return (
    <>
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 z-20 flex w-full min-w-120 flex-col border-r bg-background p-6 transition-[height] sm:static sm:z-0 sm:w-1/4 ${
          sideBarVisible ? 'h-full min-h-screen' : 'h-[5rem] overflow-hidden'
        }`}
      >
        <div className="mb-12 flex justify-between">
          <div className="self-center font-semibold text-xl">
            OnchainKit Playground
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className={`${buttonStyles} px-1 transition-transform sm:hidden ${
              sideBarVisible ? '-rotate-90' : 'rotate-90'
            }`}
          >
            <span className="pl-2">&rang;</span>
          </button>
        </div>
        <button type="button" onClick={toggleDarkMode} className={buttonStyles}>
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
        <form className="mt-4 grid gap-8">
          <DemoOptions component={activeComponent} />
        </form>
        <div className="bottom-6 left-6 text-sm sm:absolute">
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
        </div>
      </div>
      <div className="linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] flex flex-1 flex-col bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px), bg-[size:6rem_4rem]">
        <div className="flex h-full w-full flex-col items-center justify-center">
          {renderActiveComponent()}
        </div>
      </div>
    </>
  );
}

export default Demo;
