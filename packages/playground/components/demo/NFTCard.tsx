import {
  type LifecycleStatus,
  NFTCard,
  type NFTError,
} from '@coinbase/onchainkit/nft';
import {
  NFTLastSoldPrice,
  NFTMedia,
  NFTMintDate,
  NFTNetwork,
  NFTOwner,
  NFTTitle,
} from '@coinbase/onchainkit/nft/view';
import { useCallback, useContext } from 'react';
import type { TransactionReceipt } from 'viem';
import { AppContext } from '../AppProvider';

function NFTCardDemo() {
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
    <NFTCard
      contractAddress={contractAddress}
      tokenId={tokenId}
      onStatus={handleOnStatus}
      onSuccess={handleOnSuccess}
      onError={handleOnError}
    >
      <NFTMedia />
      <NFTTitle />
      <NFTOwner />
      <NFTLastSoldPrice />
      <NFTMintDate />
      <NFTNetwork />
    </NFTCard>
  );
}

export default NFTCardDemo;
