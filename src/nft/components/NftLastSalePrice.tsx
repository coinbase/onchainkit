import { useEffect, useState } from "react";
import { cn, text } from "../../styles/theme";
import { formatAmount } from "../../token/utils/formatAmount";
import { useNftContext } from "./NftProvider";
import { convertToUSD, convertWeiToEther } from "../utils/convertCurrencies";

type NftLastSalePriceProps = {
  className?: string;
  label?: string;
};

export function NftLastSalePrice({className, label = 'Mint price'}: NftLastSalePriceProps) {
  const { data } = useNftContext();

  const [usdPrice, setUsdPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsdPrice = async () => {
      const { value, currency } = data?.lastSalePrice || {};
      if (value && currency === '0x0000000000000000000000000000000000000000') {
        const usdValue = await convertToUSD(value);
        setUsdPrice(usdValue);
      }
    };

    if (data?.lastSalePrice?.value) {
      fetchUsdPrice();
    }
  }, [data?.lastSalePrice]);

  if (!data?.lastSalePrice) {
    return null;
  }

  return (
    <div className={cn(
      "flex justify-between py-1",
      text.label2,
      className
    )}>
      <div>{label}</div> 
      <div className="flex">
        <div className={text.label1}>{convertWeiToEther(data.lastSalePrice.value)} ETH</div>
        <div className="px-2">~</div>
        <div>${formatAmount(`${usdPrice}`, { maximumFractionDigits: 2 })}</div> 
      </div>
    </div>
  );
}
