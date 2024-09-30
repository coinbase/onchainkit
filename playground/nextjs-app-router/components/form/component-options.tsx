import { OnchainKitComponent } from '../AppProvider';
import { ActiveComponent } from './active-component';
import { Chain } from './chain';
import { PayOptions } from './pay-options';
import { PaymasterUrl } from './paymaster';
import { SwapConfig } from './swap-config';
import { TransactionOptions } from './transaction-options';
import { WalletType } from './wallet-type';

export const COMPONENT_OPTIONS = {
  [OnchainKitComponent.Pay]: () => {
    return (
      <>
        <ActiveComponent />
        <WalletType />
        <PayOptions />
      </>
    );
  },
  [OnchainKitComponent.Swap]: () => {
    return (
      <>
        <ActiveComponent />
        <WalletType />
        <Chain />
        <PaymasterUrl />
        <SwapConfig />
      </>
    );
  },
  [OnchainKitComponent.Transaction]: () => {
    return (
      <>
        <ActiveComponent />
        <WalletType />
        <Chain />
        <PaymasterUrl />
        <TransactionOptions />
      </>
    );
  },
  [OnchainKitComponent.Wallet]: () => {
    return (
      <>
        <ActiveComponent />
        <WalletType />
        <Chain />
      </>
    );
  },
  [OnchainKitComponent.Identity]: () => {
    return (
      <>
        <ActiveComponent />
        <WalletType />
        <Chain />
      </>
    );
  },
};
