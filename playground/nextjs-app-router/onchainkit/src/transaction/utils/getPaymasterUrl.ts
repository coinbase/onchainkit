import type { WalletCapabilities } from 'viem';

export const getPaymasterUrl = (
  capabilities?: WalletCapabilities,
): string | null => {
  return capabilities?.paymasterService?.url || null;
};
