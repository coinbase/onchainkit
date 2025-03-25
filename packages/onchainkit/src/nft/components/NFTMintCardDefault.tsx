'use client';
import {
  NFTAssetCost,
  NFTCollectionTitle,
  NFTCreator,
  NFTMintButton,
  NFTQuantitySelector,
} from '@/nft/components/mint';
import type { NFTMintCardDefaultReact } from '@/nft/types';
import { NFTMintCard } from './NFTMintCard';
import { NFTMedia } from './view';

/**
 * @deprecated Use the `NFTMintCard` component instead with no 'children' props.
 */
export function NFTMintCardDefault({
  contractAddress,
  tokenId,
  useNFTData,
  buildMintTransaction,
  isSponsored,
  onStatus,
  onSuccess,
  onError,
}: NFTMintCardDefaultReact) {
  return (
    <NFTMintCard
      contractAddress={contractAddress}
      tokenId={tokenId}
      useNFTData={useNFTData}
      buildMintTransaction={buildMintTransaction}
      isSponsored={isSponsored}
      onStatus={onStatus}
      onSuccess={onSuccess}
      onError={onError}
    >
      <NFTCreator />
      <NFTMedia />
      <NFTCollectionTitle />
      <NFTQuantitySelector />
      <NFTAssetCost />
      <NFTMintButton />
    </NFTMintCard>
  );
}
