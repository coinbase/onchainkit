import { NFTCard, NFTMintCard } from '@coinbase/onchainkit/nft';
import {
  NFTAssetCost,
  NFTCollectionTitle,
  NFTCreator,
  NFTMintButton,
  NFTQuantitySelector,
} from '@coinbase/onchainkit/nft/mint';
import {
  NFTLastSoldPrice,
  NFTMedia,
  NFTNetwork,
  NFTOwner,
  NFTTitle,
} from '@coinbase/onchainkit/nft/view';
import App from './App.tsx';

export function MintCardMain() {
  return (
    <App>
      <div className="flex items-center justify-center">
        <NFTMintCard
          contractAddress="0xed2f34043387783b2727ff2799a46ce3ae1a34d2"
          tokenId="2"
          useNFTData={() => ({
            name: 'OCK Mint Component',
            description: 'OnchainKit highlights',
            imageUrl:
              'https://ipfs.io/ipfs/bafybeifbnyvwfrbdr4r3nn7joi5eznbype27fynyat7rr52ckmqnz3camm',
            animationUrl:
              'https://ipfs.io/ipfs/bafybeia7fmwmyvxxmx6cnokvhyeyafa7gzpkhildz2keu6ca2ln3dlsxum',
            mimeType: 'video/mp4',
            contractType: 'ERC1155',
            price: {
              amount: '0.000111',
              currency: 'ETH',
              amountUSD: '0.264674505',
            },
            mintFee: {
              amount: '0.0001',
              currency: 'ETH',
              amountUSD: '0.2384455',
            },
            maxMintsPerWallet: 2,
            isEligibleToMint: true,
            creatorAddress: '0xb4e741b761d8b69103cc986f1b7cd71ed627f8cc',
            network: 'networks/base-mainnet',
            totalTokens: '1',
            totalOwners: '1',
          })}
          buildMintTransaction={() => Promise.resolve([{ callData: '0x' }])}
        >
          <NFTCreator />
          <NFTMedia />
          <NFTCollectionTitle />
          <NFTQuantitySelector />
          <NFTAssetCost />
          <NFTMintButton disabled={true} />
        </NFTMintCard>
      </div>
    </App>
  );
}

export function MintCardTitleAbove() {
  return (
    <App>
      <div className="flex items-center justify-center">
        <NFTMintCard
          contractAddress="0xb4703a3a73aec16e764cbd210b0fde9efdab8941"
          useNFTData={() => ({
            name: "Job's Not Finished",
            imageUrl:
              'https://ipfs.io/ipfs/bafybeibozzie5uy6tc2adpklc5rygchjgw5uqrgnmspzzpoveibwpqnbwy',
            mimeType: 'image/png',
          })}
        >
          <NFTCollectionTitle />
          <NFTMedia />
        </NFTMintCard>
      </div>
    </App>
  );
}

export function MintCardScaled({ square }: { square: boolean }) {
  return (
    <App>
      <NFTMintCard
        contractAddress="0x877f0f3fef81c28a8c40fe060b17d254003377ad"
        useNFTData={() => ({
          name: 'Videos',
          animationUrl:
            'https://ipfs.io/ipfs/bafybeigg7e2m2ubmntg4z7uvqzatpnkxs6w5celjky5o32uakskkrwyqpi',
          mimeType: 'video/mp4',
        })}
      >
        <NFTMedia square={square} />
      </NFTMintCard>
    </App>
  );
}

export function MintCardOverrideStyles() {
  return (
    <App>
      <div className="flex items-center justify-center">
        <NFTMintCard
          contractAddress="0xb4703a3a73aec16e764cbd210b0fde9efdab8941"
          useNFTData={() => ({
            name: "Job's Not Finished",
            imageUrl:
              'https://ipfs.io/ipfs/bafybeibozzie5uy6tc2adpklc5rygchjgw5uqrgnmspzzpoveibwpqnbwy',
            mimeType: 'image/png',
          })}
        >
          <NFTMedia />
          <NFTCollectionTitle className="text-[#EA580C]" />
        </NFTMintCard>
      </div>
    </App>
  );
}

export function ViewCardMain() {
  return (
    <App>
      <div className="flex items-center justify-center">
        <NFTCard
          contractAddress="0xb4703a3a73aec16e764cbd210b0fde9efdab8941"
          tokenId="1"
          useNFTData={() => ({
            collectionName: 'Base Around The World 2024 Recap Video',
            collectionDescription:
              'Get ready for a fast-paced journey as BASE goes global! 🌍 This recap takes you through regional buildathons across Africa, India, Southeast Asia, and Latin America, where builders came together to innovate, create, and solve local challenges—all for a chance to win from a massive 100 ETH prize pool. With a mission to onboard a billion users onchain, watch how these visionaries are shaping the future, one solution at a time!',
            name: 'Base Around The World 2024 Recap Video #1',
            description:
              'Get ready for a fast-paced journey as BASE goes global! 🌍 This recap takes you through regional buildathons across Africa, India, Southeast Asia, and Latin America, where builders came together to innovate, create, and solve local challenges—all for a chance to win from a massive 100 ETH prize pool. With a mission to onboard a billion users onchain, watch how these visionaries are shaping the future, one solution at a time!',
            imageUrl: '',
            animationUrl:
              'https://ipfs.io/ipfs/QmfAGdrbm48zie8BRjfkbc5yN8DGyM9nt9dozvAsNHGmFo/nft-gallery-1mp4',
            ownerAddress: '0x2f21f94e1e57543f4663b722b6b1bed97c576bd4',
            lastSoldPrice: {
              amount: '0.0004',
              currency: 'ETH',
              amountUSD: '0.982512',
            },
            mimeType: 'video/quicktime',
            contractType: 'ERC721',
          })}
        >
          <NFTMedia />
          <NFTTitle />
          <NFTOwner />
          <NFTLastSoldPrice />
          <NFTNetwork />
        </NFTCard>
      </div>
    </App>
  );
}

export function ViewCardTitleAbove() {
  return (
    <App>
      <div className="flex items-center justify-center">
        <NFTCard
          contractAddress="0xb4703a3a73aec16e764cbd210b0fde9efdab8941"
          useNFTData={() => ({
            name: "Job's Not Finished",
            imageUrl:
              'https://ipfs.io/ipfs/bafybeibozzie5uy6tc2adpklc5rygchjgw5uqrgnmspzzpoveibwpqnbwy',
            mimeType: 'image/png',
          })}
        >
          <NFTCollectionTitle />
          <NFTMedia />
        </NFTCard>
      </div>
    </App>
  );
}

export function ViewCardScaled({ square }: { square: boolean }) {
  return (
    <App>
      <NFTCard
        contractAddress="0x877f0f3fef81c28a8c40fe060b17d254003377ad"
        useNFTData={() => ({
          name: 'Videos',
          animationUrl:
            'https://ipfs.io/ipfs/bafybeigg7e2m2ubmntg4z7uvqzatpnkxs6w5celjky5o32uakskkrwyqpi',
          mimeType: 'video/mp4',
        })}
      >
        <NFTMedia square={square} />
      </NFTCard>
    </App>
  );
}

export function ViewCardOverrideStyles() {
  return (
    <App>
      <div className="flex items-center justify-center">
        <NFTCard
          contractAddress="0xb4703a3a73aec16e764cbd210b0fde9efdab8941"
          tokenId="1"
          useNFTData={() => ({
            name: "Job's Not Finished",
            imageUrl:
              'https://ipfs.io/ipfs/bafybeibozzie5uy6tc2adpklc5rygchjgw5uqrgnmspzzpoveibwpqnbwy',
            mimeType: 'image/png',
          })}
        >
          <NFTMedia />
          <NFTTitle className="text-[#EA580C]" />
        </NFTCard>
      </div>
    </App>
  );
}
