'use client';
import type { NFTCardDefaultReact } from '@/nft/types';
import { NFTCard } from './NFTCard';

/**
 * @deprecated Use the `NFTCard` component instead with no 'children' props.
 */
export function NFTCardDefault({
  contractAddress,
  tokenId,
  useNFTData,
  onStatus,
  onSuccess,
  onError,
}: NFTCardDefaultReact) {
  return (
    <NFTCard
      contractAddress={contractAddress}
      tokenId={tokenId}
      useNFTData={useNFTData}
      onStatus={onStatus}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}
