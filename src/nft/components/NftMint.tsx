import { background, cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { NftProvider } from './NftProvider';
import type { NftMintReact } from '../types';
import { Children } from 'react';

export function NftMint({
  children,
  className,
  contractAddress,
  tokenId,
}: NftMintReact) {
  const isMounted = useIsMounted();

  const childs = Children.toArray(children);

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <NftProvider contractAddress={contractAddress} tokenId={tokenId} isMint={true}>
      <div
        className={cn(
          background.default,
          'flex w-[500px] flex-col rounded-xl px-6 pt-6 pb-4',
          className,
        )}
        data-testid="ockNft_Container"
      >
        {childs}
      </div> 
    </NftProvider>
  )
};



