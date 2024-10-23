import { LifecycleType, type NFTMintReact } from '../types';
import { NFT } from './NFT';
import { NFTLifecycleProvider } from './NFTLifecycleProvider';
import { NFTMintProvider } from './NFTMintProvider';
import { NFTProvider } from './NFTProvider';

export function NFTMint({
  children,
  className,
  contractAddress,
  tokenId,
  useNFTData,
  useNFTMintData,
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
      >
        <NFTMintProvider
          useNFTMintData={useNFTMintData}
          buildMintTransaction={buildMintTransaction}
        >
          <NFT className={className}>{children}</NFT>
        </NFTMintProvider>
      </NFTProvider>
    </NFTLifecycleProvider>
  );
}
