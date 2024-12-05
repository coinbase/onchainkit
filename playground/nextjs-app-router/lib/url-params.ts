import { defaultState } from '@/components/AppProvider';
import { OnchainKitComponent } from '@/types/onchainkit';
import { getStorageKey } from './hooks';

const commonOptions = [
  'activeComponent',
  'componentMode',
  'componentTheme',
  'walletType',
];

const URL_PARAM_MAPPING: Partial<Record<OnchainKitComponent, string[]>> = {
  [OnchainKitComponent.Checkout]: [
    'chargeId',
    'productId',
    'checkoutTypes',
    'isSponsored',
    'checkoutOptions',
  ],
  [OnchainKitComponent.Transaction]: ['chainId', 'transactionType', 'calls'],
  [OnchainKitComponent.TransactionDefault]: [
    'chainId',
    'transactionType',
    'calls',
  ],
  [OnchainKitComponent.Swap]: ['chainId', 'defaultMaxSlippage'],
  [OnchainKitComponent.SwapDefault]: ['chainId', 'defaultMaxSlippage'],
  [OnchainKitComponent.NFTCard]: ['chainId', 'nftToken'],
  [OnchainKitComponent.NFTCardDefault]: ['chainId', 'nftToken'],
  [OnchainKitComponent.NFTMintCard]: ['chainId', 'nftToken'],
  [OnchainKitComponent.NFTMintCardDefault]: ['chainId', 'nftToken'],
};

export function getShareableUrl(activeComponent?: OnchainKitComponent) {
  if (!activeComponent) {
    return `${window.location.origin}${window.location.pathname}`;
  }

  const relevantParams = getComponentQueryParams(activeComponent);
  const params = new URLSearchParams();

  for (const param of [...relevantParams, ...commonOptions]) {
    const value = localStorage.getItem(getStorageKey(param));
    if (value && value !== defaultState[param as keyof typeof defaultState]) {
      params.set(param, value);
    }
  }

  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

export function getComponentQueryParams(component: OnchainKitComponent) {
  const options = URL_PARAM_MAPPING[component];

  return options ?? [];
}

export function initializeStateFromUrl(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const state: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    localStorage.setItem(getStorageKey(key), value);
    state[key] = value;
  }
  return state;
}
