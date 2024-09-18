import { Name } from "../../identity";
import { useNftContext } from "./NftProvider";

export function Network() {
  const { data } = useNftContext();

  return null;
  /*
  if (!data?.blockchainExplorerUrl) {
    return null;
  }

  return (
    <div className="flex justify-between">
      Created by <Name address={data.collection.creator as `0x${string}`} /> 
    </div>
  );
  */
}
