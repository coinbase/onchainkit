import type { NFTCardDefaultReact } from '../types';
import { NFTCard } from './NFTCard';
import {
  NFTLastSoldPrice,
  NFTMedia,
  NFTNetwork,
  NFTOwner,
  NFTTitle,
} from './view';

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
    >
      <NFTMedia />
      <NFTTitle />
      <NFTOwner />
      <NFTLastSoldPrice />
      <NFTNetwork />
    </NFTCard>
  );
}
