import { useRecentMints } from '../../hooks/useRecentMints';
import { useOnchainKit } from '../../../useOnchainKit';
import { Avatar, Identity, Name } from '../../../identity';
import { cn } from '../../../styles/theme';
import { useNftContext } from '../NftProvider';
import { useNftMintContext } from '../NftMintProvider';

type NftMintersTitleReact = {
  className?: string;
};

export function NftMintersTitle({ className }: NftMintersTitleReact) {
  const { schemaId, chain } = useOnchainKit();
  const { contractAddress, contractType } = useNftContext();
  const { totalOwners } = useNftMintContext();

  const recentMints = useRecentMints({
    contractAddress,
    count: 2,
    chain,
    tokenType: contractType,
  });

  if (!recentMints.isSuccess || recentMints.data?.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex py-2', className)}>
      <div className="flex space-x-[-.4rem]">
        {recentMints.data?.map((mint) => (
          <Identity
            key={mint.to}
            className="space-x-0 px-0 py-0"
            address={mint.to}
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
          address={recentMints.data?.[0].to}
          schemaId={schemaId}
        >
          <Name />
        </Identity>
        <div>and {totalOwners} others</div>
      </div>
    </div>
  );
}
