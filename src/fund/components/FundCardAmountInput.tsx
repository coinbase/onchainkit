import { type ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { cn, text } from '../../styles/theme';
import type {
  AmountInputSnippetReact,
  FundCardAmountInputPropsReact,
} from '../types';
import { formatDecimalInputValue } from '../utils/formatDecimalInputValue';
import { truncateDecimalPlaces } from '../utils/truncateDecimalPlaces';
import { AmountInputSnippet } from './AmountInputSnippet';
import { FundCardCurrencyLabel } from './FundCardCurrencyLabel';

export const FundCardAmountInput = ({
  fiatValue,
  setFiatValue,
  cryptoValue,
  setCryptoValue,
  currencySign,
  assetSymbol,
  inputType = 'fiat',
  exchangeRate = 1,
  amountInputSnippets,
}: FundCardAmountInputPropsReact) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);
  const currencySpanRef = useRef<HTMLSpanElement>(null);

  const value = inputType === 'fiat' ? fiatValue : cryptoValue;

  const handleSetAmount = useCallback(
    (amount: string) => {
      const formattedAmount = formatDecimalInputValue(amount);

      if (inputType === 'fiat') {
        const fiatValue = truncateDecimalPlaces(formattedAmount, 2);
        setFiatValue(fiatValue);

        const truncatedValue = truncateDecimalPlaces(formattedAmount, 2);

        // Calculate the crypto value based on the exchange rate
        const calculatedCryptoValue = String(
          Number(truncatedValue) * Number(exchangeRate),
        );

        const resultCryptoValue = truncateDecimalPlaces(
          calculatedCryptoValue,
          8,
        );
        setCryptoValue(calculatedCryptoValue === '0' ? '' : resultCryptoValue);
      } else {
        setCryptoValue(formattedAmount);

        const truncatedValue = truncateDecimalPlaces(formattedAmount, 8);

        // Calculate the fiat value based on the exchange rate
        const calculatedFiatValue = String(
          Number(truncatedValue) / Number(exchangeRate),
        );
        const resultFiatValue = truncateDecimalPlaces(calculatedFiatValue, 2);
        setFiatValue(resultFiatValue === '0' ? '' : resultFiatValue);
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [exchangeRate, setFiatValue, setCryptoValue, inputType],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      handleSetAmount(value);
    },
    [handleSetAmount],
  );

  const handleAmountInputSnippetClick = useCallback(
    (snippet: AmountInputSnippetReact) => {
      handleSetAmount(snippet.value);
    },
    [handleSetAmount],
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
    <div className="flex cursor-text py-6">
      <div className="flex h-20">
        {inputType === 'fiat' && currencySign && (
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
          onKeyUp={handleFocusInput}
          onClick={handleFocusInput}
          ref={inputRef}
          inputMode="decimal"
          minLength={1}
          placeholder="0"
          data-testid="ockFundCardAmountInput"
        />
        {inputType === 'crypto' && assetSymbol && (
          <FundCardCurrencyLabel
            ref={currencySpanRef}
            currencySign={assetSymbol}
          />
        )}
      </div>

      {!value && (
        <div className="flex w-[100%] flex-wrap items-center justify-end">
          {amountInputSnippets
            ?.filter((snippet) => snippet.type === inputType)
            .map((snippet) => (
              <AmountInputSnippet
                key={snippet.type + snippet.value}
                amountInputSnippet={snippet}
                onClick={handleAmountInputSnippetClick}
              />
            ))}
        </div>
      )}
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
        )}
      >
        {value ? `${value}.` : '0.'}
      </span>
    </div>
  );
};

export default FundCardAmountInput;
