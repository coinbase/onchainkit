import { LifecycleType, type NftMintReact } from '../types';
import { NFT } from './NFT';
import { NftLifecycleProvider } from './NftLifecycleProvider';
import { NftMintProvider } from './NftMintProvider';
import { NftProvider } from './NftProvider';

export function NftMint({
  children,
  className,
  contractAddress,
  tokenId,
  useNftData,
  useNftMintData,
  buildMintTransaction,
  onStatus,
  onError,
  onSuccess,
}: NftMintReact) {
  return (
    <NftLifecycleProvider
      type={LifecycleType.MINT}
      onStatus={onStatus}
      onError={onError}
      onSuccess={onSuccess}
    >
      <NftProvider
        contractAddress={contractAddress}
        tokenId={tokenId}
        useNftData={useNftData}
      >
        <NftMintProvider
          useNftMintData={useNftMintData}
          buildMintTransaction={buildMintTransaction}
        >
          <NFT className={className}>{children}</NFT>
        </NftMintProvider>
      </NftProvider>
    </NftLifecycleProvider>
  );
}
