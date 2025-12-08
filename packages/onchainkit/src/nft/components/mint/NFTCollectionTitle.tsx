import { cn, text } from '../../../styles/theme';
import { useNFTContext } from '../NFTProvider';

type NFTCollectionTitleProps = {
  className?: string;
};

export function NFTCollectionTitle({ className }: NFTCollectionTitleProps) {
  const { name } = useNFTContext();

  if (!name) {
    return null;
  }

  return (
    <div
      className={cn(text.title1, 'overflow-hidden text-ellipsis', className)}
    >
      {name}
    </div>
  );
}
