import { useNFTContext } from '@/nft/components/NFTProvider';
import { cn, text } from '../../../styles/theme';

type NFTTitleReact = {
  className?: string;
};

export function NFTTitle({ className }: NFTTitleReact) {
  const { name } = useNFTContext();

  if (!name) {
    return null;
  }

  return (
    <div
      className={cn(text.title3, 'overflow-hidden text-ellipsis', className)}
    >
      {name}
    </div>
  );
}
