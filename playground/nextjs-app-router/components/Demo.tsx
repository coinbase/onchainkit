'use client';
import { AppContext, OnchainKitComponent } from '@/components/AppProvider';
import { useContext, useEffect, useState } from 'react';
import IdentityDemo from './demo/Identity';
import PayDemo from './demo/Pay';
import SwapDemo from './demo/Swap';
import TransactionDemo from './demo/Transaction';
import WalletDemo from './demo/Wallet';
import { ActiveComponent } from './form/active-component';
import { COMPONENT_OPTIONS } from './form/component-options';

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

  function renderActiveComponent() {
    if (activeComponent === OnchainKitComponent.Identity) {
      return <IdentityDemo />;
    }

    if (activeComponent === OnchainKitComponent.Transaction) {
      return <TransactionDemo />;
    }

    if (activeComponent === OnchainKitComponent.Swap) {
      return <SwapDemo />;
    }

    if (activeComponent === OnchainKitComponent.Wallet) {
      return <WalletDemo />;
    }

    if (activeComponent === OnchainKitComponent.Pay) {
      return <PayDemo />;
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
          <ActiveComponent />
          {activeComponent && COMPONENT_OPTIONS[activeComponent]()}
        </form>
        <div className="bottom-6 left-6 sm:absolute text-sm">
          <a
            className="duration-200 hover:opacity-70 opacity-100 transition-opacity"
            href="https://github.com/coinbase/onchainkit/tree/main/playground"
            rel="noreferrer"
            target="_blank"
            title="View OnchainKit Playground on GitHub"
          >
            Github ↗
          </a>
          <a
            className="duration-200 hover:opacity-70 opacity-100 pl-4 transition-opacity"
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
        <div className="flex h-full w-full flex-col justify-center">
          {renderActiveComponent()}
        </div>
      </div>
    </>
  );
}

export default Demo;
