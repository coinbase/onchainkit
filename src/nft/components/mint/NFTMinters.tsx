import { Avatar, Identity, Name } from '@/identity';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { cn, color, text } from '@/styles/theme';
import { useOnchainKit } from '@/useOnchainKit';

type NFTMintersReact = {
  className?: string;
};

export function NFTMinters({ className }: NFTMintersReact) {
  const { schemaId } = useOnchainKit();
  const { totalOwners, recentOwners } = useNFTContext();

  if (!recentOwners || recentOwners.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        text.body,
        color.foregroundMuted,
        '-my-1 flex items-center',
        className,
      )}
    >
      <div className="flex space-x-[-.8rem]">
        {recentOwners.map((address) => (
          <Identity
            key={address}
            className="space-x-0 px-0 py-0 [&>div]:space-x-2"
            address={address}
            schemaId={schemaId}
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
          schemaId={schemaId}
        >
          <Name className="max-w-[180px] overflow-hidden text-ellipsis" />
        </Identity>
        {totalOwners && <div>and {totalOwners} others</div>}
      </div>
    </div>
  );
}
