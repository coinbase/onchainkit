import { useNFTContext } from '@/nft/components/NFTProvider';
import { COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID } from '@/identity/constants';
import type { ReactNode } from 'react';
import type { EASSchemaUid } from '@/identity/types';

import { Avatar, Badge, Identity, Name } from '@/identity';
import { cn, text } from '../../../styles/theme';

type NFTOwnerProps = {
  className?: string;
  label?: ReactNode;
  schemaId?: EASSchemaUid | null;
};

export function NFTOwner({
  className,
  label = 'Owned by',
  schemaId,
}: NFTOwnerProps) {
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
      <div className={cn('text-ock-foreground-muted')}>{label}</div>
      <Identity
        className={cn('!bg-inherit space-x-1 px-0 [&>div]:space-x-2')}
        address={ownerAddress}
        schemaId={schemaId ?? COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID}
      >
        <Avatar className="h-4 w-4" />
        <Name>
          <Badge />
        </Name>
      </Identity>
    </div>
  );
}
