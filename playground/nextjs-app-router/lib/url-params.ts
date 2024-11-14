import { OnchainKitComponent } from '@/types/onchainkit';

const URL_PARAM_MAPPING: Partial<Record<OnchainKitComponent, string[]>> = {
  [OnchainKitComponent.Checkout]: ['chargeId', 'productId'],
  [OnchainKitComponent.Transaction]: ['calls', 'contracts'],
};

export function getShareableUrl(activeComponent?: OnchainKitComponent) {
  if (!activeComponent) {
    return window.location.origin;
  }

  const relevantParams = getComponentQueryParams(activeComponent);
  const params = new URLSearchParams();

  for (const param of relevantParams) {
    params.set(param, localStorage.getItem(param) || '');
  }
  return `${window.location.origin}?${params.toString()}`;
}

export function getComponentQueryParams(component: OnchainKitComponent) {
  const options = URL_PARAM_MAPPING[component];
  if (!options) {
    return [];
  }

  return options.map((option) => option.name);
}

export function initializeStateFromUrl(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const state: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    state[key] = value;
  }
  return state;
}
