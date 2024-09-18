import { Children, useMemo } from 'react';
import { background, cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { NftProvider } from './NftProvider';
import type { NftReact } from '../types';
import { findComponent } from '../../internal/utils/findComponent';
import { NftMedia } from './NftMedia';
import { NftCollectionTitle } from './NftCollectionTitle';
import { NftTokenId } from './NftTokenId';
import { NftOwner } from './NftOwner';
import { NftLastSalePrice } from './NftLastSalePrice';
import { NftDate } from './NftDate';
import { NftQuantitySelector } from './NftQuantitySelector';

export function Nft({
  children,
  className,
  contractAddress,
  tokenId,
}: NftReact) {
  const { collectionTitle, media, displayTokenId, owner, price, date, quantitySelector } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      collectionTitle: childrenArray.find(findComponent(NftCollectionTitle)),
      media: childrenArray.find(findComponent(NftMedia)),
      displayTokenId: childrenArray.find(findComponent(NftTokenId)),
      owner: childrenArray.find(findComponent(NftOwner)),
      price: childrenArray.find(findComponent(NftLastSalePrice)),
      date: childrenArray.find(findComponent(NftDate)),
      quantitySelector: childrenArray.find(findComponent(NftQuantitySelector)),
    };
  }, [children]);

  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <NftProvider contractAddress={contractAddress} tokenId={tokenId}>
      <div
        className={cn(
          background.default,
          'flex w-[500px] flex-col rounded-xl px-6 pt-6 pb-4',
          className,
        )}
        data-testid="ockNft_Container"
      >
        {media}
        <div className='mt-4 flex gap-1'>
          {collectionTitle}
          {displayTokenId}
        </div>
        {owner}
        {price}
        {date}
        {quantitySelector}
      </div> 
    </NftProvider>
  )
};