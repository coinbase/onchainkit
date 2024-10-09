import { cn, text } from '../../styles/theme';
import { useNftContext } from './NftProvider';

type NftTitleProps = {
  className?: string;
};

export function NftTitle({ className }: NftTitleProps) {
  const { name } = useNftContext();

  if (!name) {
    return null;
  }

  return <div className={cn('py-1', text.title1, className)}>{name}</div>;
}
