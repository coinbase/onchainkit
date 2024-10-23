import { LifecycleType, type NFTMintReact } from '../types';
import { NFT } from './NFT';
import { NFTLifecycleProvider } from './NFTLifecycleProvider';
import { NFTProvider } from './NFTProvider';

export function NFTMint({
  children,
  className,
  contractAddress,
  tokenId,
  useNFTData,
  buildMintTransaction,
  onStatus,
  onError,
  onSuccess,
}: NFTMintReact) {
  return (
    <NFTLifecycleProvider
      type={LifecycleType.MINT}
      onStatus={onStatus}
      onError={onError}
      onSuccess={onSuccess}
    >
      <NFTProvider
        contractAddress={contractAddress}
        tokenId={tokenId}
        useNFTData={useNFTData}
        buildMintTransaction={buildMintTransaction}
      >
        <NFT className={className}>{children}</NFT>
      </NFTProvider>
    </NFTLifecycleProvider>
  );
}
