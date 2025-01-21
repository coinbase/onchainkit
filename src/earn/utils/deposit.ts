import type { Address, WalletClient } from 'viem';

type DepositToMorphoArgs = {
  vaultAddress: Address;
  tokenAddress: Address;
  amount: bigint;
  receiverAddress: Address;
};

export async function depositToMorpho({
  wallet,
  args: { vaultAddress, tokenAddress, amount, receiverAddress },
}: {
  wallet: WalletClient;
  args: DepositToMorphoArgs;
}) {}
