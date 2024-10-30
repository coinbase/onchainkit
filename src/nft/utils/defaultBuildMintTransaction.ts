import type { Address } from 'viem';
import { buildMintTransaction } from '../../api/buildMintTransaction';
import type { BuildMintTransactionParams } from '../../api/types';
import type { Call } from '../../transaction/types';

export async function defaultBuildMintTransaction({
  contractAddress,
  tokenId,
  network,
  quantity,
  takerAddress,
}: { contractAddress: Address } & Omit<
  BuildMintTransactionParams,
  'mintAddress'
>): Promise<Call[]> {
  const mintTransactions = await buildMintTransaction({
    mintAddress: contractAddress,
    tokenId,
    network,
    quantity,
    takerAddress,
  });

  if ('error' in mintTransactions) {
    throw new Error(mintTransactions.message);
  }

  return [
    {
      to: mintTransactions.callData.to,
      data: mintTransactions.callData.data,
      value: BigInt(mintTransactions.callData.value),
    },
  ];
}
