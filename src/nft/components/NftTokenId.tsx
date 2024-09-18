import { cn, text } from "../../styles/theme";
import { useNftContext } from "./NftProvider";

type NftTokenIdProps = {
  className?: string;
};

export function NftTokenId({ className }: NftTokenIdProps) {
  const { tokenId } = useNftContext();

  return (
    <div className={cn(
      text.headline,
      className,
    )}>
      #{tokenId}
    </div>
  );
}
