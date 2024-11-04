import type { ReactNode } from 'react';
import { Avatar, Identity, Name } from '../../../identity';
import { cn, color, text } from '../../../styles/theme';
import { useNFTContext } from '../NFTProvider';

type NFTOwnerReact = {
  className?: string;
  label?: ReactNode;
};

export function NFTOwner({ className, label = 'Owned by' }: NFTOwnerReact) {
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
      <div className={cn(color.foregroundMuted)}>{label}</div>
      <Identity
        className={cn('!bg-inherit space-x-1 px-0 [&>div]:space-x-2')}
        address={ownerAddress}
      >
        <Avatar className="h-4 w-4" />
        <Name />
      </Identity>
    </div>
  );
}
