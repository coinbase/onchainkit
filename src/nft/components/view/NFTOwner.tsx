import type { ReactNode } from 'react';
import { Avatar, Badge, Identity, Name } from '../../../identity';
import { cn, text } from '../../../styles/theme';
import { useOnchainKit } from '../../../useOnchainKit';
import { useNFTContext } from '../NFTProvider';

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
        'flex items-center justify-between',
        text.label2,
        className,
      )}
    >
      <div>{label}</div>
      <Identity
        className={cn('!bg-inherit space-x-2 px-0')}
        address={ownerAddress}
        schemaId={schemaId}
      >
        <Avatar className="h-5 w-5" />
        <Name>
          <Badge />
        </Name>
      </Identity>
    </div>
  );
}
