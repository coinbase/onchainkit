import { type ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { cn, text } from '../../styles/theme';
import type { FundCardAmountInputPropsReact } from '../types';
import { FundCardCurrencyLabel } from './FundCardCurrencyLabel';
import { formatDecimalInputValue } from '../utils/formatDecimalInputValue';
import { truncateDecimalPlaces } from '../utils/truncateDecimalPlaces';

export const FundCardAmountInput = ({
  fiatValue,
  setFiatValue,
  cryptoValue,
  setCryptoValue,
  currencySign,
  assetSymbol,
  inputType = 'fiat',
  exchangeRate = 1,
}: FundCardAmountInputPropsReact) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);
  const currencySpanRef = useRef<HTMLSpanElement>(null);

  const value = inputType === 'fiat' ? fiatValue : cryptoValue;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      value = formatDecimalInputValue(value);

      if (inputType === 'fiat') {
        const fiatValue = truncateDecimalPlaces(value, 2);
        setFiatValue(fiatValue);

        // Calculate the crypto value based on the exchange rate
        const calculatedCryptoValue = String(
          Number(value) * Number(exchangeRate),
        );

        const resultCryptoValue = truncateDecimalPlaces(
          calculatedCryptoValue,
          8,
        );
        setCryptoValue(calculatedCryptoValue === '0' ? '' : resultCryptoValue);
      } else {
        setCryptoValue(value);

        // Calculate the fiat value based on the exchange rate
        const calculatedFiatValue = String(
          Number(value) / Number(exchangeRate),
        );
        const resultFiatValue = truncateDecimalPlaces(calculatedFiatValue, 2);
        setFiatValue(resultFiatValue === '0' ? '' : resultFiatValue);
      }
    },
    [exchangeRate, setFiatValue, setCryptoValue, inputType],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: When value changes, we want to update the input width
  useEffect(() => {
    if (hiddenSpanRef.current) {
      const width = Math.max(42, hiddenSpanRef.current.offsetWidth);
      const currencyWidth =
        currencySpanRef.current?.getBoundingClientRect().width || 0;

      // Set the input width based on the span width
      if (inputRef.current) {
        inputRef.current.style.width = `${width}px`;
        inputRef.current.style.maxWidth = `${390 - currencyWidth}px`;
      }
    }
  }, [value]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want to focus the input when the input type changes
  useEffect(() => {
    // focus the input when the input type changes
    handleFocusInput();
  }, [inputType]);

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className='flex cursor-text py-6' onClick={handleFocusInput} onKeyUp={handleFocusInput}>
      <style>
        {`
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            appearance: none;
            margin: 0;
          }

          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>

      <div className="flex" style={{ height: '78px' }}>
        {/* Display the fiat currency sign before the input*/}
        {inputType === 'fiat' && currencySign && (
          <FundCardCurrencyLabel
            ref={currencySpanRef}
            currencySign={currencySign}
          />
        )}

        <input
          className={cn(
            text.body,
            'border-[none] bg-transparent',
            'text-[3.75rem] leading-none outline-none',
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
        {/* Display the crypto asset symbol after the input*/}
        {inputType === 'crypto' && assetSymbol && (
          <FundCardCurrencyLabel
            ref={currencySpanRef}
            currencySign={assetSymbol}
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
          'border-[none] bg-transparent',
          'text-[3.75rem] leading-none outline-none',
        )}
        style={{
          position: 'absolute',
          opacity: 0,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {value ? `${value}.` : '0.'}
      </span>
    </div>
  );
};

export default FundCardAmountInput;
