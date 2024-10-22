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

  return <div className={cn('py-2', text.title1, className)}>{name}</div>;
}
