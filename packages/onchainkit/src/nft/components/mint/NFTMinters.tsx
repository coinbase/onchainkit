import { Avatar, Identity, Name } from '@/identity';
import { COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID } from '@/identity/constants';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { cn, text } from '@/styles/theme';
import type { EASSchemaUid } from '@/identity/types';

type NFTMintersProps = {
  className?: string;
  schemaId?: EASSchemaUid | null;
};

export function NFTMinters({ className, schemaId }: NFTMintersProps) {
  const { totalOwners, recentOwners } = useNFTContext();

  if (!recentOwners || recentOwners.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        text.body,
        'text-ock-foreground-muted',
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
            schemaId={schemaId ?? COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID}
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
