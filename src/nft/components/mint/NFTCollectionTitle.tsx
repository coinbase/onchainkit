import { cn, text } from '../../../styles/theme';
import { useNFTContext } from '../NFTProvider';

type NFTCollectionTitleReact = {
  className?: string;
};

export function NFTCollectionTitle({ className }: NFTCollectionTitleReact) {
  const { name } = useNFTContext();

  if (!name) {
    return null;
  }

  return <div className={cn('pt-3 pb-1', text.title1, className)}>{name}</div>;
}
