import { useOnchainKit } from '../../../useOnchainKit';
import { Avatar, Identity, Name } from '../../../identity';
import { cn } from '../../../styles/theme';
import { useNftMintContext } from '../NftMintProvider';

type NftMintersTitleReact = {
  className?: string;
};

export function NftMintersTitle({ className }: NftMintersTitleReact) {
  const { schemaId } = useOnchainKit();
  const { totalOwners, recentOwners } = useNftMintContext();

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
          <Name />
        </Identity>
        <div>and {totalOwners} others</div>
      </div>
    </div>
  );
}
