import { AmountInput } from '@/internal/components/amount-input/AmountInput';
import type { FundCardAmountInputPropsReact } from '../types';
import { useFundContext } from './FundCardProvider';

export const FundCardAmountInput = ({
  className,
}: FundCardAmountInputPropsReact) => {
  const {
    fundAmountFiat,
    fundAmountCrypto,
    asset,
    selectedInputType,
    currency,
    exchangeRate,
    setFundAmountFiat,
    setFundAmountCrypto,
  } = useFundContext();

  return (
    <AmountInput
      fiatAmount={fundAmountFiat}
      cryptoAmount={fundAmountCrypto}
      asset={asset}
      selectedInputType={selectedInputType}
      currency={currency}
      className={className}
      setFiatAmount={setFundAmountFiat}
      setCryptoAmount={setFundAmountCrypto}
      exchangeRate={String(exchangeRate)}
    />
  );
};

export default FundCardAmountInput;
