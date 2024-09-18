import { cn, text } from "../../styles/theme";
import { formatAmount } from "../../token/utils/formatAmount";
import { useNftContext } from "./NftProvider";

type NftTotalCostProps = {
  className?: string;
};

export function NftTotalCost({className}:NftTotalCostProps) {
  const { data } = useNftContext();

  if (!data?.price) {
    return null;
  }

  return (
    <div className={cn(
      'flex pt-1 pb-0', 
      text.body, 
      className
    )}>
      <div className={text.headline}>{data.price.amount?.decimal} {data.price.currency?.symbol}</div>
      <div className="px-2">~</div>
      <div>${formatAmount(`${data.price.amount?.usd}`, { maximumFractionDigits: 2 })}</div> 
    </div>
  );
}
