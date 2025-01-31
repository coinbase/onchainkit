import { useInputResize } from '@/internal/hooks/useInputResize';
import { cn, text } from '@/styles/theme';
import { useCallback, useEffect, useRef } from 'react';
import { useAmountInput } from '../../hooks/useAmountInput';
import { isValidAmount } from '../../utils/isValidAmount';
import { TextInput } from '../TextInput';
import { CurrencyLabel } from './CurrencyLabel';

type AmountInputProps = {
  asset: string;
  currency: string;
  fiatAmount: string;
  cryptoAmount: string;
  selectedInputType: 'fiat' | 'crypto';
  setFiatAmount: (value: string) => void;
  setCryptoAmount: (value: string) => void;
  exchangeRate: string;
  className?: string;
};

export function AmountInput({
  fiatAmount,
  cryptoAmount,
  asset,
  selectedInputType,
  currency,
  className,
  setFiatAmount,
  setCryptoAmount,
  exchangeRate,
}: AmountInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const currencyOrAsset = selectedInputType === 'fiat' ? currency : asset;
  const value = selectedInputType === 'fiat' ? fiatAmount : cryptoAmount;

  const updateScale = useInputResize(
    containerRef,
    wrapperRef,
    inputRef,
    measureRef,
    labelRef,
  );

  const { handleChange } = useAmountInput({
    setFiatAmount,
    setCryptoAmount,
    selectedInputType,
    exchangeRate,
  });

  const handleAmountChange = useCallback(
    (value: string) => {
      handleChange(value, () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
    },
    [handleChange],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateScale();
  }, [value, updateScale]);

  const selectedInputTypeRef = useRef(selectedInputType);

  useEffect(() => {
    /**
     * We need to focus the input when the input type changes
     * but not on the initial render.
     */
    if (selectedInputTypeRef.current !== selectedInputType) {
      selectedInputTypeRef.current = selectedInputType;
      handleFocusInput();
    }
  }, [selectedInputType]);

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      data-testid="ockAmountInputContainer"
      className={cn('relative h-24 cursor-text', className)}
    >
      <div className="absolute inset-x-0 top-6 bottom-4">
        <div className="relative flex h-14">
          <div ref={wrapperRef} className="flex flex-shrink-0 items-center">
            <TextInput
              className={cn(
                text.body,
                'border-none bg-transparent',
                'text-6xl leading-none outline-none',
                '[appearance:textfield]',
                '[&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none',
                '[&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none',
              )}
              value={value}
              onChange={handleAmountChange}
              inputValidator={isValidAmount}
              ref={inputRef}
              inputMode="decimal"
              placeholder="0"
            />
            <div className="ml-1">
              <CurrencyLabel ref={labelRef} label={currencyOrAsset} />
            </div>
          </div>
        </div>
      </div>

      <span
        data-testid="ockHiddenSpan"
        ref={measureRef}
        className={cn(
          text.body,
          'border-none bg-transparent',
          'text-6xl leading-none outline-none',
          'pointer-events-none absolute whitespace-nowrap opacity-0',
          'left-[-99999px]',
        )}
      >
        {value ? `${value}.` : '0.'}
      </span>
    </div>
  );
}
