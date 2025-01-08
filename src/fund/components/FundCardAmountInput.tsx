import { type ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { cn, text } from '../../styles/theme';
import { useInputResize } from '../hooks/useInputResize';
import type { FundCardAmountInputPropsReact } from '../types';
import { formatDecimalInputValue } from '../utils/formatDecimalInputValue';
import { truncateDecimalPlaces } from '../utils/truncateDecimalPlaces';
import { FundCardCurrencyLabel } from './FundCardCurrencyLabel';
import { useFundContext } from './FundCardProvider';

export const FundCardAmountInput = ({
  className,
}: FundCardAmountInputPropsReact) => {
  const currencySign = '$';
  const {
    fundAmountFiat,
    setFundAmountFiat,
    fundAmountCrypto,
    setFundAmountCrypto,
    selectedAsset,
    selectedInputType,
    exchangeRate,
  } = useFundContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);
  const currencySpanRef = useRef<HTMLSpanElement>(null);

  const value =
    selectedInputType === 'fiat' ? fundAmountFiat : fundAmountCrypto;

  const updateInputWidth = useInputResize(
    containerRef,
    inputRef,
    hiddenSpanRef,
    currencySpanRef,
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = formatDecimalInputValue(e.target.value);

      if (selectedInputType === 'fiat') {
        const fiatValue = truncateDecimalPlaces(value, 2);
        setFundAmountFiat(fiatValue);

        const truncatedValue = truncateDecimalPlaces(value, 2);

        // Calculate the crypto value based on the exchange rate
        const calculatedCryptoValue = String(
          Number(truncatedValue) * Number(exchangeRate),
        );

        const resultCryptoValue = truncateDecimalPlaces(
          calculatedCryptoValue,
          8,
        );
        setFundAmountCrypto(
          calculatedCryptoValue === '0' ? '' : resultCryptoValue,
        );
      } else {
        const truncatedValue = truncateDecimalPlaces(value, 8);

        setFundAmountCrypto(truncatedValue);

        // Calculate the fiat value based on the exchange rate
        const calculatedFiatValue = String(
          Number(truncatedValue) / Number(exchangeRate),
        );
        const resultFiatValue = truncateDecimalPlaces(calculatedFiatValue, 2);
        setFundAmountFiat(resultFiatValue === '0' ? '' : resultFiatValue);
      }
    },
    [exchangeRate, setFundAmountFiat, setFundAmountCrypto, selectedInputType],
  );

  // Update width when value changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateInputWidth();
  }, [value, updateInputWidth]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want to focus the input when the input type changes
  useEffect(() => {
    // focus the input when the input type changes
    handleFocusInput();
  }, [selectedInputType]);

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      data-testid="ockFundCardAmountInputContainer"
      className={cn('flex cursor-text py-6', className)}
      onClick={handleFocusInput}
      onKeyUp={handleFocusInput}
    >
      <div className="flex h-20">
        {selectedInputType === 'fiat' && currencySign && (
          <FundCardCurrencyLabel
            ref={currencySpanRef}
            currencySign={currencySign}
          />
        )}

        <input
          className={cn(
            text.body,
            'border-none bg-transparent',
            'text-6xl leading-none outline-none',
            '[appearance:textfield]',
            '[&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none',
            '[&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none',
          )}
          type="number"
          value={value}
          onChange={handleChange}
          ref={inputRef}
          inputMode="decimal"
          minLength={1}
          placeholder="0"
          data-testid="ockFundCardAmountInput"
        />
        {selectedInputType === 'crypto' && selectedAsset && (
          <FundCardCurrencyLabel
            ref={currencySpanRef}
            currencySign={selectedAsset}
          />
        )}
      </div>

      {/* Hidden span for measuring text width 
          Without this span the input field would not adjust its width based on the text width and would look like this:
          [0.12--------Empty Space-------][ETH] - As you can see the currency symbol is far away from the inputed value

          With this span we can measure the width of the text in the input field and set the width of the input field to match the text width
          [0.12][ETH] - Now the currency symbol is displayed next to the input field
      */}
      <span
        data-testid="ockHiddenSpan"
        ref={hiddenSpanRef}
        className={cn(
          text.body,
          'border-none bg-transparent',
          'text-6xl leading-none outline-none',
          'pointer-events-none absolute whitespace-nowrap opacity-0',
          'left-[-9999px]', // Hide the span from the DOM
        )}
      >
        {value ? `${value}.` : '0.'}
      </span>
    </div>
  );
};

export default FundCardAmountInput;
