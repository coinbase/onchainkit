import { NFTMintCardDefault } from '@coinbase/onchainkit/nft';
import { WalletDefault } from '@coinbase/onchainkit/wallet';
import type { ReactNode } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import App from '../App.tsx';

export const nftMintCardDemoCode = `
  import { useAccount } from 'wagmi';
  import { NFTMintCardDefault } from '@coinbase/onchainkit/nft';
  import { WalletDefault } from '@coinbase/onchainkit/wallet';

  function NftMintCardDemo() {
    const { address } = useAccount();
    return (
      <>
        {address ? (
          <NFTMintCardDefault
            contractAddress="0xed2f34043387783b2727ff2799a46ce3ae1a34d2"
            tokenId="2"
          />
        ) : (
          <WalletDefault />
        )}
      </>
    )
  }
`;

type MintCardWrapperChildrenProps = {
  address: Address | undefined;
};

type MintCardWrapperReact = {
  children: (props: MintCardWrapperChildrenProps) => ReactNode;
};

export default function NftMintCardDemo() {
  return (
    <App>
      <NftMintCardDemoWrapper>
        {({ address }) =>
          address ? (
            <NFTMintCardDefault
              contractAddress="0xed2f34043387783b2727ff2799a46ce3ae1a34d2"
              tokenId="2"
            />
          ) : (
            <WalletDefault />
          )
        }
      </NftMintCardDemoWrapper>
    </App>
  );
}

function NftMintCardDemoWrapper({ children }: MintCardWrapperReact) {
  const { address } = useAccount();
  return <div>{children({ address })}</div>;
}
