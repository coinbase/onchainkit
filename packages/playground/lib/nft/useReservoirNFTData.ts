import { useMemo } from 'react';
import { useToken } from './useToken';

type ContractType = 'ERC721' | 'ERC1155';

// eslint-disable-next-line complexity
export function useReservoirNFTData(contractAddress: string, tokenId = '0') {
  const { data: token } = useToken(contractAddress, tokenId);

  const mintDate = useMemo(() => {
    if (!token?.mintedAt) {
      return undefined;
    }

    if (new Date(token.mintedAt).getTime() === 0) {
      return undefined;
    }

    return new Date(token.mintedAt);
  }, [token?.mintedAt]);

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
    mintDate,
  };
}
