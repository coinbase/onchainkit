import type { BuildMintTransactionDataProps } from '@/onchainkit/esm/nft/types';
import type { Call } from '@/onchainkit/esm/transaction/types';
import type { definitions } from '@reservoir0x/reservoir-sdk';
import { ENVIRONMENT_VARIABLES } from '../constants';

const ERROR_MAP = {
  'Unable to mint requested quantity (max mints per wallet possibly exceeded)':
    'Mint limit exceeded',
} as Record<string, string>;

async function getMintData({
  contractAddress,
  takerAddress,
  tokenId,
  quantity,
}: BuildMintTransactionDataProps): Promise<Call[]> {
  try {
    const items = tokenId
      ? [{ token: `${contractAddress}:${tokenId}`, quantity }]
      : [{ collection: contractAddress, quantity }];

    const response = await fetch(
      'https://api-base.reservoir.tools/execute/mint/v1?skipBalanceCheck=true',
      {
        method: 'POST',
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          'x-api-key': ENVIRONMENT_VARIABLES.RESERVOIR_API_KEY ?? '',
        },
        body: JSON.stringify({
          items,
          taker: takerAddress,
        }),
      },
    );

    const data = await response.json();

    if (data.message) {
      const error = ERROR_MAP[data.message] ?? data.message;
      return Promise.reject(error);
    }

    const validData = data as definitions['postExecuteMintV1Response'];

    const saleStep = validData.steps?.find((step) => step.id === 'sale');
    if (!saleStep) {
      return Promise.reject('No valid price found');
    }

    return saleStep.items.map((item) => ({
      data: item.data?.data as `0x${string}`,
      to: item.data?.to as `0x${string}`,
      value: BigInt((item.data?.value ?? '') as string) as bigint,
    }));
  } catch (err) {
    if (err instanceof Error) {
      return Promise.reject(err.message);
    }
    return Promise.reject('Unknown Mint error');
  }
}

export function buildMintTransaction({
  contractAddress,
  takerAddress,
  tokenId,
  quantity,
}: BuildMintTransactionDataProps): Promise<Call[]> {
  return getMintData({
    contractAddress,
    takerAddress,
    tokenId,
    quantity,
  });
}
