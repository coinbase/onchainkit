'use client';

import { AmountInput } from '@/internal/components/amount-input/AmountInput';
import { SendAmountInputTypeSwitch } from './SendAmountInputTypeSwitch';
import { useSendContext } from './SendProvider';

type SendAmountInputProps = {
  className?: string;
  textClassName?: string;
};

export function SendAmountInput({
  className,
  textClassName,
}: SendAmountInputProps) {
  const {
    selectedToken,
    cryptoAmount,
    handleCryptoAmountChange,
    fiatAmount,
    handleFiatAmountChange,
    selectedInputType,
    exchangeRate,
  } = useSendContext();

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <AmountInput
        fiatAmount={fiatAmount ?? ''}
        cryptoAmount={cryptoAmount ?? ''}
        asset={selectedToken?.symbol ?? ''}
        currency="USD"
        selectedInputType={selectedInputType}
        setFiatAmount={handleFiatAmountChange}
        setCryptoAmount={handleCryptoAmountChange}
        exchangeRate={String(exchangeRate)}
        className={className}
        textClassName={textClassName}
      />

      <SendAmountInputTypeSwitch />
    </div>
  );
}
