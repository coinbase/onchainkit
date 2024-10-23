import { Avatar, Identity, Name } from '../../../identity';
import { cn } from '../../../styles/theme';
import { useOnchainKit } from '../../../useOnchainKit';
import { useNftContext } from '../NftProvider';

type NftMintersReact = {
  className?: string;
};

export function NftMinters({ className }: NftMintersReact) {
  const { schemaId } = useOnchainKit();
  const { totalOwners, recentOwners } = useNftContext();

  if (!recentOwners || recentOwners.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex py-2', className)}>
      <div className="flex space-x-[-.4rem]">
        {recentOwners.map((address) => (
          <Identity
            key={address}
            className="space-x-0 px-0 py-0"
            address={address}
            schemaId={schemaId}
          >
            <Avatar className="h-5 w-5" />
          </Identity>
        ))}
      </div>
      <div className="flex px-2">
        <div>Minted by</div>
        <Identity
          className="px-1 py-0"
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
