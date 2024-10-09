import { cn, text } from '../../styles/theme';
import { formatAmount } from '../../token/utils/formatAmount';
import { useNftContext } from './NftProvider';
import { useEthPrice } from '../../internal/hooks/useEthPrice';
import { convertWeiToEther } from '../utils/convertWeiToEther';

type NftLastSoldPriceProps = {
  className?: string;
  label?: string;
};

const getDisplayCurrency = (currency: string) => {
  if (currency === '0x0000000000000000000000000000000000000000') {
    return 'ETH';
  }
  return '';
};

export function NftLastSoldPrice({
  className,
  label = 'Mint price',
}: NftLastSoldPriceProps) {
  const {
    lastSoldPrice: { price, currency },
  } = useNftContext();
  const ethPrice = useEthPrice();

  if (!price || !currency || !ethPrice.data) {
    return null;
  }

  const nativePrice = convertWeiToEther(price);
  const usdPrice = nativePrice * ethPrice.data;

  return (
    <div className={cn('flex justify-between py-2', text.label2, className)}>
      <div>{label}</div>
      <div className="flex">
        <div className={text.label1}>
          {nativePrice} {getDisplayCurrency(currency)}
        </div>
        <div className="px-2">~</div>
        <div>
          $
          {formatAmount(`${usdPrice}`, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </div>
  );
}
