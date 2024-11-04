import { Avatar, Identity, Name } from '../../../identity';
import { cn, color, text } from '../../../styles/theme';
import { useNFTContext } from '../NFTProvider';

type NFTMintersReact = {
  className?: string;
};

export function NFTMinters({ className }: NFTMintersReact) {
  const { totalOwners, recentOwners } = useNFTContext();

  if (!recentOwners || recentOwners.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        text.body,
        color.foregroundMuted,
        'flex items-center py-0.5',
        className,
      )}
    >
      <div className="flex space-x-[-.8rem]">
        {recentOwners.map((address) => (
          <Identity
            key={address}
            className="space-x-0 px-0 py-0 [&>div]:space-x-2"
            address={address}
          >
            <Avatar className="h-4 w-4" />
          </Identity>
        ))}
      </div>
      <div className="flex">
        <div>Minted by</div>
        <Identity
          className="px-1 py-0 [&>div]:space-x-0"
          address={recentOwners[0]}
        >
          <Name className="max-w-[180px] overflow-hidden text-ellipsis" />
        </Identity>
        {totalOwners && <div>and {totalOwners} others</div>}
      </div>
    </div>
  );
}
