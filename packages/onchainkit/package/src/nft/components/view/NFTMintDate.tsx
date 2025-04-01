import { useNFTContext } from '@/nft/components/NFTProvider';
import { type ReactNode, useMemo } from 'react';
import { cn, color, text } from '../../../styles/theme';

const DATE_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
} as Intl.DateTimeFormatOptions;

type NFTMintDateReact = {
  className?: string;
  label?: ReactNode;
};

export function NFTMintDate({
  className,
  label = 'Mint date',
}: NFTMintDateReact) {
  const { mintDate } = useNFTContext();

  const formattedDate = useMemo(() => {
    if (!mintDate) {
      return null;
    }
    const formatter = new Intl.DateTimeFormat(undefined, DATE_OPTIONS);
    return formatter.format(mintDate);
  }, [mintDate]);

  if (!formattedDate) {
    return null;
  }

  return (
    <div
      className={cn(
        text.label2,
        'flex items-center justify-between',
        className,
      )}
    >
      <div className={cn(color.foregroundMuted)}>{label}</div>
      <div>{formattedDate}</div>
    </div>
  );
}
