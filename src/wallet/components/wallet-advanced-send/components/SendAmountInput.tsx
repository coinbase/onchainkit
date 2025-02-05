'use client';

import { AmountInput } from '@/internal/components/amount-input/AmountInput';
import type { SendAmountInputProps } from '../types';
import { SendAmountInputTypeSwitch } from './SendAmountInputTypeSwitch';

export function SendAmountInput({
  selectedToken,
  cryptoAmount,
  handleCryptoAmountChange,
  fiatAmount,
  handleFiatAmountChange,
  selectedInputType,
  setSelectedInputType,
  exchangeRate,
  exchangeRateLoading,
  className,
  textClassName,
}: SendAmountInputProps) {
  return (
    <div className="flex h-full w-full flex-col justify-center">
      <AmountInput
        fiatAmount={fiatAmount ?? ''}
        cryptoAmount={cryptoAmount ?? ''}
        asset={selectedToken?.symbol ?? ''}
        currency={'USD'}
        selectedInputType={selectedInputType}
        setFiatAmount={handleFiatAmountChange}
        setCryptoAmount={handleCryptoAmountChange}
        exchangeRate={String(exchangeRate)}
        className={className}
        textClassName={textClassName}
      />

      <SendAmountInputTypeSwitch
        selectedToken={selectedToken ?? null}
        fiatAmount={fiatAmount ?? ''}
        cryptoAmount={cryptoAmount ?? ''}
        selectedInputType={selectedInputType}
        setSelectedInputType={setSelectedInputType}
        exchangeRate={exchangeRate}
        exchangeRateLoading={exchangeRateLoading}
      />
    </div>
  );
}
