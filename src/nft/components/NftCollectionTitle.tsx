import { cn, text } from "../../styles/theme";
import { useNftContext } from "./NftProvider";

type NftCollectionTitleProps = {
  className?: string;
};

export function NftCollectionTitle({ className }: NftCollectionTitleProps) {
  const { data } = useNftContext();

  if (!data?.collection?.name) {
    return null;
  }

  return (
    <div className={cn(
      text.headline,
      className,
    )}>
      {data.collection?.name}
    </div>
  );
}
