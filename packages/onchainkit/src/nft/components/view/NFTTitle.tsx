import { useNFTContext } from '@/nft/components/NFTProvider';
import { cn, text } from '../../../styles/theme';

type NFTTitleProps = {
  className?: string;
};

export function NFTTitle({ className }: NFTTitleProps) {
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
