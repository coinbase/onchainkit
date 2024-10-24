import { buildMintTransaction } from '@/lib/buildMintTransaction';
import { useReservoirMintData } from '@/lib/useReservoirMintData';
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

// adidas 0xc6A1F929B7cA5D76e0fA21EB44da1E48765990C5 ERC1155
// autumn 0x473d2D4C09669962c2CbDB1c34ba8f0fc843Fb69
// fall at the florida zoo 0x8443d418e82c3A2A530013218D49E0347BA13fDe ERC1155
// some other base mint 0x96c2E93Aa994D0A467f377c77075B00421EFB046  ERC1155
// bored ape gang 0x381b0d693dc6c5ea556838e8604ae000510a16ac 1
// persona 0x6502820f3f035c7a9fc0ebd3d74a0383306c5137
// mochimons 0x949bed087ff0241e04e98d807de3c3dd97eaa381
// hoomans 0xbe3c7abab76f0a1de602fdb2f44faf604a5f649f
// mr miggles video 0x1f52841279fA4dE8B606a70373E9c84e84Ce9204
// cb quarterly earnings 0x1D6b183bD47F914F9f1d3208EDCF8BefD7F84E63
// audio - 0x05a28e3d5f68c8b4a521ab7f74bd887fae6a598d base song

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
