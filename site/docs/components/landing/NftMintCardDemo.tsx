import { NFTMintCardDefault } from '@coinbase/onchainkit/nft';
import App from '../App.tsx';

export const nftMintCardDemoCode = `
  import { NFTMintCardDefault } from '@coinbase/onchainkit/nft';

  function NftMintCardDemo() {
    return (
      <NFTMintCardDefault
        contractAddress="0x61245eF5C4857a0dAf22E0cE4e29CB1c316BEC1C"
        tokenId="1"
      />
    )
  }
`;

export default function NftMintCardDemo() {
  return (
    <App>
      <NFTMintCardDefault
        contractAddress="0x61245eF5C4857a0dAf22E0cE4e29CB1c316BEC1C"
        tokenId="1"
      />
    </App>
  );
}
