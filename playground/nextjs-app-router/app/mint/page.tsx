'use client';

import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { buildMintTransaction } from '@/lib/nft/buildMintTransaction';
import { useReservoirMintData } from '@/lib/nft/useReservoirMintData';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { NFTMintCard } from '@coinbase/onchainkit/nft';
import { NFTCollectionTitle, NFTMintButton } from '@coinbase/onchainkit/nft/mint';
import { NFTMedia } from '@coinbase/onchainkit/nft/view';
import { base } from 'wagmi/chains';

export default function Mint() {
  return (
    <main className="flex w-full bg-white justify-center items-center">
      <OnchainKitProvider
        apiKey={ENVIRONMENT_VARIABLES[ENVIRONMENT.API_KEY]}
        chain={base}
        config={{
          appearance: {
            mode: "light",
            theme: "default",
          },
        }}
        projectId={ENVIRONMENT_VARIABLES[ENVIRONMENT.PROJECT_ID]}
        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
      >
        <NFTMintCard 
          className="bg-white"
          contractAddress="0x1D6b183bD47F914F9f1d3208EDCF8BefD7F84E63" 
          tokenId="3" 
          useNFTData={useReservoirMintData}
          buildMintTransaction={buildMintTransaction}>
          <NFTMedia/>
          <NFTCollectionTitle/>
          <NFTMintButton/>
        </NFTMintCard>
      </OnchainKitProvider>
    </main>
  );
}
