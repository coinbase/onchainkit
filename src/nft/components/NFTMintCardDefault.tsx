import type { NFTMintCardDefaultReact } from '../types';
import { NFTMintCard } from './NFTMintCard';
import {
  NFTAssetCost,
  NFTCollectionTitle,
  NFTCreator,
  NFTMintButton,
  NFTQuantitySelector,
} from './mint';
import { NFTMedia } from './view';

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
