import { buildMintTransaction as buildMintTransactionApi } from '@/api/buildMintTransaction';
import type { BuildMintTransactionParams } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import type { Address } from 'viem';
import type { Call } from '../../transaction/types';

async function getMintTransaction({
  mintAddress,
  tokenId,
  network,
  quantity,
  takerAddress,
}: BuildMintTransactionParams): Promise<Call[]> {
  const mintTransactions = await buildMintTransactionApi(
    {
      mintAddress,
      tokenId,
      network,
      quantity,
      takerAddress,
    },
    RequestContext.NFT,
  );

  if ('error' in mintTransactions) {
    throw mintTransactions.message;
  }

  return [
    {
      to: mintTransactions.call_data.to,
      data: mintTransactions.call_data.data,
      value: BigInt(mintTransactions.call_data.value),
    },
  ];
}

export function buildMintTransactionData({
  contractAddress,
  takerAddress,
  tokenId,
  quantity,
  network,
}: { contractAddress: Address } & Omit<
  BuildMintTransactionParams,
  'mintAddress'
>): Promise<Call[]> {
  return getMintTransaction({
    mintAddress: contractAddress,
    takerAddress,
    tokenId,
    quantity,
    network,
  });
}
