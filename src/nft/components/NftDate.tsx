import { useMemo } from 'react';
import { cn, text } from "../../styles/theme";
import { useNftContext } from "./NftProvider";

type NftDateProps = {
  className?: string;
  label?: string;
};

const DATE_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
} as Intl.DateTimeFormatOptions;

export function NftDate({className, label = 'Mint date'}: NftDateProps) {
  const { data } = useNftContext();

  return null;
  /*
  const formattedDate = useMemo(() => {
    if (!data?.mintedAt) {
      return null;
    }

    const formatter = new Intl.DateTimeFormat(undefined, DATE_OPTIONS);
    return formatter.format(new Date(data.mintedAt));
  }, [data?.mintedAt]);

  if (!data?.mintedAt) {
    return null;
  }

  return (
    <div className={cn(
      "flex justify-between py-1",
      text.label2,
      className
    )}>
      <div>{label}</div> 
      <div>{formattedDate}</div>
    </div>
  );
  */
}
