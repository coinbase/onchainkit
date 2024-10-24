import { buildMintTransaction } from '@/lib/nft/buildMintTransaction';
import { useReservoirMintData } from '@/lib/nft/useReservoirMintData';
import {
  type LifecycleStatus,
  type NFTError,
  NFTMintCard,
} from '@coinbase/onchainkit/nft';
import {
  NFTAssetCost,
  NFTCollectionTitle,
  NFTCreator,
  NFTMintButton,
  NFTMinters,
  NFTQuantitySelector,
  NFTTotalCost,
} from '@coinbase/onchainkit/nft/mint';
import { NFTMedia } from '@coinbase/onchainkit/nft/view';
import { useCallback, useContext } from 'react';
import type { TransactionReceipt } from 'viem';
import { AppContext } from '../AppProvider';

function NFTMintCardDemo() {
  const { nftToken } = useContext(AppContext);

  const [contractAddress, tokenId] = (
    nftToken ?? '0x1D6b183bD47F914F9f1d3208EDCF8BefD7F84E63:1'
  ).split(':') as [`0x${string}`, string];

  const handleOnStatus = useCallback((lifecycleStatus: LifecycleStatus) => {
    console.log('Status:', lifecycleStatus);
  }, []);

  const handleOnSuccess = useCallback(
    (transactionReceipt?: TransactionReceipt) => {
      console.log('Success:', transactionReceipt);
    },
    [],
  );

  const handleOnError = useCallback((nftError: NFTError) => {
    console.log('Error:', nftError);
  }, []);

  return (
    <NFTMintCard
      contractAddress={contractAddress}
      tokenId={tokenId}
      useNFTData={useReservoirMintData}
      buildMintTransaction={buildMintTransaction}
      onStatus={handleOnStatus}
      onSuccess={handleOnSuccess}
      onError={handleOnError}
    >
      <NFTCreator />
      <NFTMedia />
      <NFTCollectionTitle />
      <NFTMinters />
      <NFTQuantitySelector />
      <NFTAssetCost />
      <NFTMintButton />
      <NFTTotalCost />
    </NFTMintCard>
  );
}

export default NFTMintCardDemo;
