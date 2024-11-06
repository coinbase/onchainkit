import { cn, text } from '../../../styles/theme';
import { useNFTContext } from '../NFTProvider';

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
      className={cn(
        text.title3,
        'overflow-hidden text-ellipsis pt-3 pb-1',
        className,
      )}
    >
      {name}
    </div>
  );
}
