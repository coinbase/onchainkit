import { ComponentMode } from '@/components/form/component-mode';
import { ComponentTheme } from '@/components/form/component-theme';
import { PaymasterUrl } from '@/components/form/paymaster';
import { OnchainKitComponent } from './AppProvider';
import { ActiveComponent } from './form/active-component';
import { Chain } from './form/chain';
import { CheckoutOptions } from './form/checkout-options';
import { IsSponsored } from './form/is-sponsored';
import { NFTOptions } from './form/nft-options';
import { SwapConfig } from './form/swap-config';
import { TransactionOptions } from './form/transaction-options';
import { WalletType } from './form/wallet-type';

export default function DemoOptions({
  component,
}: {
  component?: OnchainKitComponent;
}) {
  const commonOptions = (
    <>
      <ActiveComponent />
      <ComponentMode />
      <ComponentTheme />
      <WalletType />
    </>
  );

  switch (component) {
    case OnchainKitComponent.Checkout:
      return (
        <>
          {commonOptions}
          <Chain />
          <PaymasterUrl />
          <IsSponsored />
          <CheckoutOptions />
        </>
      );
    case OnchainKitComponent.Swap:
    case OnchainKitComponent.SwapDefault:
      return (
        <>
          {commonOptions}
          <Chain />
          <PaymasterUrl />
          <IsSponsored />
          <SwapConfig />
        </>
      );
    case OnchainKitComponent.Transaction:
    case OnchainKitComponent.TransactionDefault:
      return (
        <>
          {commonOptions}
          <Chain />
          <PaymasterUrl />
          <IsSponsored />
          <TransactionOptions />
        </>
      );
    case OnchainKitComponent.NFTCard:
      return (
        <>
          {commonOptions}
          <Chain />
          <NFTOptions />
        </>
      );
    case OnchainKitComponent.NFTMintCard:
      return (
        <>
          {commonOptions}
          <Chain />
          <PaymasterUrl />
          <IsSponsored />
          <NFTOptions />
        </>
      );
    default:
      return commonOptions;
  }
}
