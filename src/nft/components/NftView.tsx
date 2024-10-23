import { LifecycleType, type NftViewReact } from '../types';
import { NFT } from './NFT';
import { NftLifecycleProvider } from './NftLifecycleProvider';
import { NftProvider } from './NftProvider';

export function NftView({
  children,
  className,
  contractAddress,
  tokenId,
  useNftData,
  onStatus,
  onError,
  onSuccess,
}: NftViewReact) {
  return (
    <NftLifecycleProvider
      type={LifecycleType.VIEW}
      onStatus={onStatus}
      onError={onError}
      onSuccess={onSuccess}
    >
      <NftProvider
        contractAddress={contractAddress}
        tokenId={tokenId}
        useNftData={useNftData}
      >
        <NFT className={className}>{children}</NFT>
      </NftProvider>
    </NftLifecycleProvider>
  );
}
