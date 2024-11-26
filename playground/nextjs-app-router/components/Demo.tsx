'use client';
import { AppContext } from '@/components/AppProvider';
import { getShareableUrl } from '@/lib/url-params';
import { cn } from '@/lib/utils';
import { OnchainKitComponent } from '@/types/onchainkit';
import { useContext, useEffect, useState } from 'react';
import DemoOptions from './DemoOptions';
import CheckoutDemo from './demo/Checkout';
import FundDemo from './demo/Fund';
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
import WalletDefaultDemo from './demo/WalletDefault';
import { TokenSelectDropdown } from '@coinbase/onchainkit/token';

const activeComponentMapping: Record<OnchainKitComponent, React.FC> = {
  [OnchainKitComponent.Fund]: FundDemo,
  [OnchainKitComponent.Identity]: IdentityDemo,
  [OnchainKitComponent.Transaction]: TransactionDemo,
  [OnchainKitComponent.Checkout]: CheckoutDemo,
  [OnchainKitComponent.Swap]: SwapDemo,
  [OnchainKitComponent.SwapDefault]: SwapDefaultDemo,
  [OnchainKitComponent.Wallet]: WalletDemo,
  [OnchainKitComponent.WalletDefault]: WalletDefaultDemo,
  [OnchainKitComponent.TransactionDefault]: TransactionDefaultDemo,
  [OnchainKitComponent.NFTMintCard]: NFTMintCardDemo,
  [OnchainKitComponent.NFTCard]: NFTCardDemo,
  [OnchainKitComponent.NFTMintCardDefault]: NFTMintCardDefaultDemo,
  [OnchainKitComponent.NFTCardDefault]: NFTCardDefaultDemo,
  [OnchainKitComponent.IdentityCard]: IdentityCardDemo,
};

function Demo() {
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
        <div className="flex h-full w-full flex-col items-center justify-center">
          {/* {ActiveComponent && <ActiveComponent />} */}

          <div className="w-[500px]">
            <TokenSelectDropdown
              options={[
                {
                  name: 'Ethereum',
                  address: '',
                  symbol: 'ETH',
                  decimals: 18,
                  image:
                    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
                  chainId: 8453,
                },
                {
                  name: 'USDC',
                  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
                  symbol: 'USDC',
                  decimals: 6,
                  image:
                    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
                  chainId: 8453,
                },
                {
                  name: 'Dai',
                  address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
                  symbol: 'DAI',
                  decimals: 18,
                  image:
                    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/d0/d7/d0d7784975771dbbac9a22c8c0c12928cc6f658cbcf2bbbf7c909f0fa2426dec-NmU4ZWViMDItOTQyYy00Yjk5LTkzODUtNGJlZmJiMTUxOTgy',
                  chainId: 8453,
                },
              ]}
              setToken={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Demo;
