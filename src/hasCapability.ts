import type { WalletCapabilities } from 'viem';

export function hasCapability({
  capability,
  walletCapabilities,
}: {
  capability: string;
  walletCapabilities: WalletCapabilities;
}): boolean {
  return walletCapabilities[capability]?.supported || false;
}
