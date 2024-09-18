import { useOnchainKit } from "../..";
import { Avatar, Badge, Identity, Name } from "../../identity";
import { cn, text } from "../../styles/theme";
import { useNftContext } from "./NftProvider";

type NftOwnerProps = {
  className?: string;
  label?: string;
};

export function NftOwner({className, label = 'Owned by'}:NftOwnerProps) {
  const { schemaId } = useOnchainKit();
  const { data } = useNftContext();

  if (!data?.owner) {
    return null;
  }

  return (
    <div className={cn(
      'flex items-center justify-between pt-1 pb-0', 
      text.label2, 
      className
    )}>
      <div>{label}</div>
      <Identity className='space-x-2 px-0' address={data.owner as `0x${string}`} schemaId={schemaId}>
        <Avatar className='h-5 w-5'/>
        <Name>
          <Badge/>
        </Name>
      </Identity>
    </div>
  );
}


/*

can multiple people mint the same NFT?

https://basescan.org/token/0xc6a1f929b7ca5d76e0fa21eb44da1e48765990c5?a=0

is this an 1155 thing?  shouldn't each minter get a unique token id?

*/