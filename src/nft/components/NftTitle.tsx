import { cn, text } from '../../styles/theme';
import { useNftViewContext } from './NftViewProvider';

type NftTitleProps = {
  className?: string;
};

export function NftTitle({ className }: NftTitleProps) {
  const { name } = useNftViewContext();

  if (!name) {
    return null;
  }

  return <div className={cn('py-1', text.title1, className)}>{name}</div>;
}
