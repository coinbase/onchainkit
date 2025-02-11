'use client';
import { AppContext } from '@/components/AppProvider';
import { EarnDemo } from '@/components/demo/Earn';
import { getShareableUrl } from '@/lib/url-params';
import { cn } from '@/lib/utils';
import { OnchainKitComponent } from '@/types/onchainkit';
import { useContext, useEffect, useState } from 'react';
import DemoOptions from './DemoOptions';
import BuyDemo from './demo/Buy';
import CheckoutDemo from './demo/Checkout';
import FundButtonDemo from './demo/FundButton';
import FundCardDemo from './demo/FundCard';
import IdentityDemo from './demo/Identity';
import { IdentityCardDemo } from './demo/IdentityCard';
import NFTCardDemo from './demo/NFTCard';
import NFTCardDefaultDemo from './demo/NFTCardDefault';
import NFTMintCardDemo from './demo/NFTMintCard';
import NFTMintCardDefaultDemo from './demo/NFTMintCardDefault';
import SwapDemo from './demo/Swap';
import SwapDefaultDemo from './demo/SwapDefault';
import TransactionDemo from './demo/Transaction';
import TransactionDefaultDemo from './demo/TransactionDefault';
import WalletDemo from './demo/Wallet';
import WalletAdvancedDefaultDemo from './demo/WalletAdvancedDefault';
import WalletDefaultDemo from './demo/WalletDefault';
import WalletIslandDemo from './demo/WalletIsland';

const activeComponentMapping: Record<OnchainKitComponent, React.FC> = {
  [OnchainKitComponent.FundButton]: FundButtonDemo,
  [OnchainKitComponent.FundCard]: FundCardDemo,
  [OnchainKitComponent.Buy]: BuyDemo,
  [OnchainKitComponent.Identity]: IdentityDemo,
  [OnchainKitComponent.Transaction]: TransactionDemo,
  [OnchainKitComponent.Checkout]: CheckoutDemo,
  [OnchainKitComponent.Swap]: SwapDemo,
  [OnchainKitComponent.SwapDefault]: SwapDefaultDemo,
  [OnchainKitComponent.Wallet]: WalletDemo,
  [OnchainKitComponent.WalletDefault]: WalletDefaultDemo,
  [OnchainKitComponent.WalletIsland]: WalletIslandDemo,
  [OnchainKitComponent.WalletAdvancedDefault]: WalletAdvancedDefaultDemo,
  [OnchainKitComponent.TransactionDefault]: TransactionDefaultDemo,
  [OnchainKitComponent.NFTMintCard]: NFTMintCardDemo,
  [OnchainKitComponent.NFTCard]: NFTCardDemo,
  [OnchainKitComponent.NFTMintCardDefault]: NFTMintCardDefaultDemo,
  [OnchainKitComponent.NFTCardDefault]: NFTCardDefaultDemo,
  [OnchainKitComponent.IdentityCard]: IdentityCardDemo,
  [OnchainKitComponent.Earn]: EarnDemo,
};

export default function Demo() {
  const { activeComponent } = useContext(AppContext);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sideBarVisible, setSideBarVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyShareableLink = () => {
    const url = getShareableUrl(activeComponent);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const ActiveComponent = activeComponent
    ? activeComponentMapping[activeComponent]
    : null;

  return (
    <>
      <div
        className={cn(
          'absolute top-0 right-0 bottom-0 left-0 z-20 flex w-full min-w-80 flex-col border-r bg-background p-6 transition-[height] sm:static sm:z-0 sm:w-1/4',
          sideBarVisible ? 'h-full min-h-screen' : 'h-20 overflow-hidden',
        )}
      >
        <div className="mb-12 flex justify-between">
          <div className="self-center font-semibold text-xl">
            OnchainKit Playground
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              buttonStyles,
              'px-1 transition-transform sm:hidden',
              sideBarVisible ? '-rotate-90' : 'rotate-90',
            )}
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
        <div className="mt-auto flex items-center justify-between pt-6 text-sm">
          <div>
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

          <button
            type="button"
            onClick={copyShareableLink}
            className="opacity-100 transition-opacity duration-200 hover:opacity-70"
          >
            {copied ? 'Copied!' : 'Share ↗'}
          </button>
        </div>
      </div>
      <div className="linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] flex flex-1 flex-col bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px), bg-[size:6rem_4rem]">
        <div
          className={cn(
            'flex h-full w-full flex-col items-center',
            activeComponent === OnchainKitComponent.WalletAdvancedDefault
              ? 'mt-12 justify-start'
              : 'justify-center',
          )}
        >
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </>
  );
}
