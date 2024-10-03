import { OnchainKitComponent } from '../AppProvider';
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
        <WalletType />
        <PayOptions />
      </>
    );
  },
  [OnchainKitComponent.Swap]: () => {
    return (
      <>
        <WalletType />
        <Chain />
        <SwapConfig />
      </>
    );
  },
  [OnchainKitComponent.Transaction]: () => {
    return (
      <>
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
        <WalletType />
        <Chain />
      </>
    );
  },
  [OnchainKitComponent.Identity]: () => {
    return (
      <>
        <WalletType />
        <Chain />
      </>
    );
  },
};
