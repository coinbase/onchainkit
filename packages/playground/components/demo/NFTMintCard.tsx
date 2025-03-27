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
} from '@coinbase/onchainkit/nft/mint';
import { NFTMedia } from '@coinbase/onchainkit/nft/view';
import { useCallback, useContext } from 'react';
import type { TransactionReceipt } from 'viem';
import { AppContext } from '../AppProvider';

function NFTMintCardDemo() {
  const { nftToken, isSponsored } = useContext(AppContext);

  const [contractAddress, tokenId] = (
    nftToken ?? '0x44dF55B47F24B73190657fE9107Ca43234bbc21E'
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
      isSponsored={isSponsored}
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
    </NFTMintCard>
  );
}

export default NFTMintCardDemo;
