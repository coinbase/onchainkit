import { ComponentMode } from '@/components/form/component-mode';
import { ComponentTheme } from '@/components/form/component-theme';
import { PaymasterUrl } from '@/components/form/paymaster';
import { OnchainKitComponent } from './AppProvider';
import { ActiveComponent } from './form/active-component';
import { Chain } from './form/chain';
import { CheckoutOptions } from './form/checkout-options';
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
      <ComponentMode />
      <ComponentTheme />
      <ActiveComponent />
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
          <CheckoutOptions />
        </>
      );
    case OnchainKitComponent.Swap || OnchainKitComponent.SwapDefault:
      return (
        <>
          {commonOptions}
          <Chain />
          <PaymasterUrl />
          <SwapConfig />
        </>
      );
    case OnchainKitComponent.Transaction ||
      OnchainKitComponent.TransactionDefault:
      return (
        <>
          {commonOptions}
          <Chain />
          <PaymasterUrl />
          <TransactionOptions />
        </>
      );
    default:
      return commonOptions;
  }
}
