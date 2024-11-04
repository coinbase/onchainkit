import { Avatar, Identity, Name } from '../../../identity';
import { cn } from '../../../styles/theme';
import { useNFTContext } from '../NFTProvider';

type NFTCreatorReact = {
  className?: string;
};

export function NFTCreator({ className }: NFTCreatorReact) {
  const { creatorAddress } = useNFTContext();

  if (!creatorAddress) {
    return null;
  }

  return (
    <div className={cn('flex justify-between pb-2', className)}>
      <Identity className="px-0 [&>div]:space-x-2" address={creatorAddress}>
        <Avatar className="h-4 w-4" />
        <Name />
      </Identity>
    </div>
  );
}
