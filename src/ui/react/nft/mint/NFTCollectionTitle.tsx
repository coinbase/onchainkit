import { useNFTContext } from '../../../../core-react/nft/providers/NFTProvider';
import { cn, text } from '../../../../styles/theme';

type NFTCollectionTitleReact = {
  className?: string;
};

export function NFTCollectionTitle({ className }: NFTCollectionTitleReact) {
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
