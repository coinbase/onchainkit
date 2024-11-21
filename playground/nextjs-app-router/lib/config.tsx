import { OnchainKitComponent } from '@/components/AppProvider';
import { Chain } from '@/components/form/chain';
import { CheckoutOptions } from '@/components/form/checkout-options';
import { IsSponsored } from '@/components/form/is-sponsored';
import { NFTOptions } from '@/components/form/nft-options';
import { PaymasterUrl } from '@/components/form/paymaster';
import { SwapConfig } from '@/components/form/swap-config';
import { TransactionOptions } from '@/components/form/transaction-options';

export const COMPONENT_CONFIG: Partial<
  Record<OnchainKitComponent, (() => React.JSX.Element)[]>
> = {
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
};
