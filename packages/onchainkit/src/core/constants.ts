// Capabilities
export const Capabilities = {
  AtomicBatch: 'atomicBatch',
  AuxiliaryFunds: 'auxiliaryFunds',
  PaymasterService: 'paymasterService',
} as const;

export type CapabilitiesType = (typeof Capabilities)[keyof typeof Capabilities];

export const DEFAULT_PRIVACY_URL = 'https://base.org/privacy-policy';
export const DEFAULT_TERMS_URL = 'https://base.org/terms-of-service';
