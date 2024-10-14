import { useMemo } from 'react';
import { cn, text } from '../../../styles/theme';
import { useNftContext } from '../NftProvider';

const DATE_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
} as Intl.DateTimeFormatOptions;

type NftMintDateProps = {
  className?: string;
  label?: string;
};

export function NftMintDate({
  className,
  label = 'Mint date',
}: NftMintDateProps) {
  const { mintDate } = useNftContext();

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
        'flex items-center justify-between pt-1 pb-0',
        text.label2,
        className,
      )}
    >
      <div>{label}</div>
      <div>{formattedDate}</div>
    </div>
  );
}
