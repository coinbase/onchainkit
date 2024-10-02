import { Avatar, Badge, Identity, Name } from '../../../identity';
import { cn, text } from '../../../styles/theme';
import { useOnchainKit } from '../../../useOnchainKit';
import { useNftContext } from '../NftProvider';

type NftOwnerProps = {
  className?: string;
  label?: string;
};

export function NftOwner({ className, label = 'Owned by' }: NftOwnerProps) {
  const { schemaId } = useOnchainKit();
  const { ownerAddress } = useNftContext();

  if (!ownerAddress) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between pt-2 pb-1',
        text.label2,
        className,
      )}
    >
      <div>{label}</div>
      <Identity
        className="space-x-2 px-0"
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
