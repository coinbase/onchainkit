import { LifecycleType, type NFTViewReact } from '../types';
import { NFT } from './NFT';
import { NFTLifecycleProvider } from './NFTLifecycleProvider';
import { NFTProvider } from './NFTProvider';

export function NFTView({
  children,
  className,
  contractAddress,
  tokenId,
  useNFTData,
  onStatus,
  onError,
  onSuccess,
}: NFTViewReact) {
  return (
    <NFTLifecycleProvider
      type={LifecycleType.VIEW}
      onStatus={onStatus}
      onError={onError}
      onSuccess={onSuccess}
    >
      <NFTProvider
        contractAddress={contractAddress}
        tokenId={tokenId}
        useNFTData={useNFTData}
      >
        <NFT className={className}>{children}</NFT>
      </NFTProvider>
    </NFTLifecycleProvider>
  );
}
