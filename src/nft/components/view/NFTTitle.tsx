import { cn, text } from '../../../styles/theme';
import { useNFTContext } from '../NFTProvider';

type NFTTitleProps = {
  className?: string;
};

export function NFTTitle({ className }: NFTTitleProps) {
  const { name } = useNFTContext();

  if (!name) {
    return null;
  }

  return (
    <div className={cn('pt-3 pb-1', text.headline, className)}>{name}</div>
  );
}
