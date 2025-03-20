'use client';
import { AmountInputTypeSwitch } from '@/internal/components/amount-input/AmountInputTypeSwitch';
import type { FundCardAmountInputTypeSwitchPropsReact } from '../types';
import { useFundContext } from './FundCardProvider';

export const FundCardAmountInputTypeSwitch = ({
  className,
}: FundCardAmountInputTypeSwitchPropsReact) => {
  const {
    selectedInputType,
    setSelectedInputType,
    asset,
    fundAmountFiat,
    fundAmountCrypto,
    exchangeRate,
    exchangeRateLoading,
    currency,
  } = useFundContext();

  return (
    <AmountInputTypeSwitch
      selectedInputType={selectedInputType}
      setSelectedInputType={setSelectedInputType}
      asset={asset}
      fiatAmount={fundAmountFiat}
      cryptoAmount={fundAmountCrypto}
      exchangeRate={exchangeRate}
      exchangeRateLoading={exchangeRateLoading}
      currency={currency}
      className={className}
    />
  );
};

export default FundCardAmountInputTypeSwitch;
