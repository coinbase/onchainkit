import { useNFTContext } from '@/nft/components/NFTProvider';
import { useOnchainKit } from '@/useOnchainKit';
import type { ReactNode } from 'react';

import { Avatar, Badge, Identity, Name } from '@/identity';
import { cn, color, text } from '../../../styles/theme';

type NFTOwnerReact = {
  className?: string;
  label?: ReactNode;
};

export function NFTOwner({ className, label = 'Owned by' }: NFTOwnerReact) {
  const { schemaId } = useOnchainKit();
  const { ownerAddress } = useNFTContext();

  if (!ownerAddress) {
    return null;
  }

  return (
    <div
      className={cn(
        text.label2,
        '-my-1 flex items-center justify-between',
        className,
      )}
    >
      <div className={cn(color.foregroundMuted)}>{label}</div>
      <Identity
        className={cn('!bg-inherit space-x-1 px-0 [&>div]:space-x-2')}
        address={ownerAddress}
        schemaId={schemaId}
      >
        <Avatar className="h-4 w-4" />
        <Name>
          <Badge />
        </Name>
      </Identity>
    </div>
  );
}
