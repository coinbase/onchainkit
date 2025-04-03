'use client';
import { useAmountInput } from '@/internal/hooks/useAmountInput';
import { FundCardPresetAmountInputItem } from './FundCardPresetAmountInputItem';
import { useFundContext } from './FundCardProvider';

export function FundCardPresetAmountInputList() {
  const {
    presetAmountInputs,
    currency,
    selectedInputType,
    exchangeRate,
    setFundAmountFiat,
    setFundAmountCrypto,
  } = useFundContext();

  const { handleFiatChange } = useAmountInput({
    setFiatAmount: setFundAmountFiat,
    setCryptoAmount: setFundAmountCrypto,
    selectedInputType,
    exchangeRate: String(exchangeRate),
  });

  if (!presetAmountInputs) {
    return null;
  }

  return (
    <div
      data-testid="ockPresetAmountInputList"
      className="flex w-full flex-wrap items-center justify-between gap-2 pt-8"
    >
      {presetAmountInputs.map((amount, index) => (
        <FundCardPresetAmountInputItem
          key={index}
          presetAmountInput={amount}
          onClick={handleFiatChange}
          currency={currency}
        />
      ))}
    </div>
  );
}
