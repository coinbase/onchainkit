import { ComponentMode } from '@/components/form/component-mode';
import { ComponentTheme } from '@/components/form/component-theme';
import { EarnOptions } from '@/components/form/earn-options';
import { PaymasterUrl } from '@/components/form/paymaster';
import { OnchainKitComponent } from '@/types/onchainkit';
import { ActiveComponent } from './form/active-component';
import { Chain } from './form/chain';
import { CheckoutOptions } from './form/checkout-options';
import { IsSponsored } from './form/is-sponsored';
import { NFTOptions } from './form/nft-options';
import { SwapConfig } from './form/swap-config';
import { TransactionOptions } from './form/transaction-options';
import { WalletType } from './form/wallet-type';

const COMMON_OPTIONS = [
  ActiveComponent,
  ComponentMode,
  ComponentTheme,
  WalletType,
];

const COMPONENT_CONFIG: Partial<
  Record<OnchainKitComponent, (() => React.JSX.Element)[]>
> = {
  [OnchainKitComponent.Buy]: [Chain, PaymasterUrl, IsSponsored, SwapConfig],
  [OnchainKitComponent.Checkout]: [
    Chain,
    PaymasterUrl,
    IsSponsored,
    CheckoutOptions,
  ],
  [OnchainKitComponent.Swap]: [Chain, PaymasterUrl, IsSponsored, SwapConfig],
  [OnchainKitComponent.SwapDefault]: [
    Chain,
    PaymasterUrl,
    IsSponsored,
    SwapConfig,
  ],
  [OnchainKitComponent.Transaction]: [
    Chain,
    PaymasterUrl,
    IsSponsored,
    TransactionOptions,
  ],
  [OnchainKitComponent.TransactionDefault]: [
    Chain,
    PaymasterUrl,
    IsSponsored,
    TransactionOptions,
  ],
  [OnchainKitComponent.NFTCard]: [Chain, NFTOptions],
  [OnchainKitComponent.NFTCardDefault]: [Chain, NFTOptions],
  [OnchainKitComponent.NFTMintCard]: [
    Chain,
    PaymasterUrl,
    IsSponsored,
    NFTOptions,
  ],
  [OnchainKitComponent.NFTMintCardDefault]: [
    Chain,
    PaymasterUrl,
    IsSponsored,
    NFTOptions,
  ],
  [OnchainKitComponent.Earn]: [EarnOptions],
};

export default function DemoOptions({
  component,
}: {
  component?: OnchainKitComponent;
}) {
  const commonElements = COMMON_OPTIONS.map((Component) => (
    <Component key={Component.name} />
  ));

  const specificElements = component
    ? (COMPONENT_CONFIG[component] || []).map((Component) => (
        <Component key={Component.name} />
      ))
    : [];

  return (
    <>
      {commonElements}
      {specificElements}
    </>
  );
}
