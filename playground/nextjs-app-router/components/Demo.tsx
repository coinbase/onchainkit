'use client';
import { AppContext, OnchainKitComponent } from '@/components/AppProvider';
import { Chain } from '@/components/form/chain';
import { PaymasterUrl } from '@/components/form/paymaster';
import { WalletType } from '@/components/form/wallet-type';
import { useContext, useEffect } from 'react';
import SwapDemo from './demo/Swap';
import TransactionDemo from './demo/Transaction';
import WalletDemo from './demo/Wallet';
import { ActiveComponent } from './form/active-component';

function Demo() {
  const { activeComponent } = useContext(AppContext);
  useEffect(() => {
    console.log('Playground.activeComponent:', activeComponent);
  }, [activeComponent]);

  return (
    <>
      <div className="hidden w-1/4 min-w-120 flex-col border-r bg-background p-6 sm:flex">
        <div className="mb-12 font-semibold text-lg">OnchainKit Playground</div>
        <form className="grid gap-8">
          <ActiveComponent />
          <WalletType />
          <Chain />
          <PaymasterUrl />
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
      <div className="flex flex-1 flex-col bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="flex h-full w-full flex-col justify-center">
          {activeComponent === OnchainKitComponent.Transaction ? (
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
