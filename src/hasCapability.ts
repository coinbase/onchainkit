import type { WalletCapabilities } from 'viem';

export function hasCapability({
  capability,
  walletCapabilities,
}: {
  capability: string;
  walletCapabilities: WalletCapabilities;
}): boolean {
  console.log('Has capability', capability, walletCapabilities);
  console.log(
    walletCapabilities[capability],
    walletCapabilities[capability].supported,
  );
  return (
    walletCapabilities[capability] && walletCapabilities[capability].supported
  );
}
