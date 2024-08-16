'use client';

import { AppContext, OnchainKitComponent } from '@/components/AppProvider';
import { Chain } from '@/components/form/chain';
import { PaymasterUrl } from '@/components/form/paymaster';
import { WalletType } from '@/components/form/wallet-type';
import { useContext } from 'react';
import SwapDemo from './demo/Swap';
import TransactionDemo from './demo/Transaction';
import WalletDemo from './demo/Wallet';
import { ActiveComponent } from './form/active-component';

function Demo() {
  const { activeComponent } = useContext(AppContext);

  console.log('activeComponent', activeComponent);
  console.log(
    'activeComponent is transaction',
    activeComponent === OnchainKitComponent.Transaction
  );

  return (
    <>
      <div className="hidden min-w-120 w-1/4 flex-col border-r bg-background p-6 sm:flex">
        <div className="mb-12 text-lg font-semibold">OnchainKit Playground</div>
        <form className="grid gap-8">
          <ActiveComponent />
          <WalletType />
          <Chain />
          <PaymasterUrl />
        </form>
        <a
          target="_blank"
          className="hover:underline text-sm absolute bottom-6 left-6"
          href="https://github.com/coinbase/onchainkit/tree/main/playground"
          rel="noreferrer"
          title="View OnchainKit Playground on GitHub"
        >
          View Github
        </a>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col justify-center w-full h-full">
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
