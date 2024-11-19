import { NFTMintCardDefault } from '@coinbase/onchainkit/nft';
import App from '../App.tsx';

export const nftMintCardDemoCode = `
  import { NFTMintCardDefault } from '@coinbase/onchainkit/nft';

  function NftMintCardDemo() {
    return (
      <NFTMintCardDefault
        contractAddress="0xb4703a3a73aec16e764cbd210b0fde9efdab8941"
        tokenId="1"
      />
    )
  }
`;

export default function NftMintCardDemo() {
  return (
    <App>
      <NFTMintCardDefault
        contractAddress="0xb4703a3a73aec16e764cbd210b0fde9efdab8941"
        tokenId="1"
      />
    </App>
  );
}
