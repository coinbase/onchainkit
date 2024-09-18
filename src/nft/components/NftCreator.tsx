import { Avatar, Badge, Identity, Name } from "../../identity";
import { useOnchainKit } from "../../useOnchainKit";
import { useNftContext } from "./NftProvider";

export function NftCreator() {
  const { schemaId } = useOnchainKit();
  const { data } = useNftContext();

  if (!data?.collection?.creator) {
    return null;
  }

  return (
    <div className="flex justify-between">
      <Identity className='space-x-2 px-0' address={data.collection.creator as `0x${string}`} schemaId={schemaId}>
        <Avatar className='h-5 w-5'/>
        <Name>
          <Badge />
        </Name>
      </Identity>      
    </div>
  );
}
