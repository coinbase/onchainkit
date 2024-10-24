import type { ContractType } from '@/onchainkit/esm/nft/types';
import { useToken } from './useToken';

export function useReservoirNFTData(contractAddress: string, tokenId = '0') {
  const { data: token } = useToken(contractAddress, tokenId);

  return {
    name: token?.name,
    description: token?.description,
    imageUrl: token?.image,
    animationUrl: token?.media,
    mimeType: (token?.metadata?.mediaMimeType ??
      token?.metadata?.imageMimeType ??
      '') as string,
    ownerAddress: token?.owner as `0x${string}`,
    lastSoldPrice: {
      amount: token?.lastSale?.price?.amount?.decimal,
      currency: token?.lastSale?.price?.currency?.symbol,
      amountUSD: token?.lastSale?.price?.amount?.usd,
    },
    contractType: token?.kind?.toUpperCase() as ContractType,
    mintDate: token?.mintedAt ? new Date(token?.mintedAt) : undefined,
  };
}
