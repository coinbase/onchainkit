'use client';

import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { buildMintTransaction } from '@/lib/nft/buildMintTransaction';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { NFTMintCard } from '@coinbase/onchainkit/nft';
import type { LifecycleStatus } from '@coinbase/onchainkit/nft';
import {
  NFTCollectionTitle,
  NFTCreator,
  NFTMintButton,
} from '@coinbase/onchainkit/nft/mint';
import { NFTMedia } from '@coinbase/onchainkit/nft/view';
import { useCallback } from 'react';
import { base } from 'wagmi/chains';
import { useEarningsData } from './hooks/useEarningsData';

export default function MintComponent() {
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('status', status);
  }, []);

  return (
    <main className="flex w-full items-center justify-center">
      <NFTMintCard
        contractAddress="0x1D6b183bD47F914F9f1d3208EDCF8BefD7F84E63"
        tokenId="2"
        useNFTData={useEarningsData}
        buildMintTransaction={buildMintTransaction}
        onStatus={handleOnStatus}
      >
        <NFTCreator className="-mt-1 pt-0" />
        <NFTMedia />
        <NFTCollectionTitle />
        <NFTMintButton />
      </NFTMintCard>
    </main>
  );
}
