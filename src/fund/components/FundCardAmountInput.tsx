import { type ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { cn, text } from '../../styles/theme';
import { useInputResize } from '../hooks/useInputResize';
import type {
  AmountInputSnippetReact,
  FundCardAmountInputPropsReact,
} from '../types';
import { formatDecimalInputValue } from '../utils/formatDecimalInputValue';
import { truncateDecimalPlaces } from '../utils/truncateDecimalPlaces';
import { AmountInputSnippet } from './AmountInputSnippet';
import { FundCardCurrencyLabel } from './FundCardCurrencyLabel';
import { useFundContext } from './FundCardProvider';

export const FundCardAmountInput = ({
  className,
}: FundCardAmountInputPropsReact) => {
  // TODO: Get currency label from country
  const currencyLabel = 'USD';
  const {
    fundAmountFiat,
    setFundAmountFiat,
    fundAmountCrypto,
    setFundAmountCrypto,
    asset,
    selectedInputType,
    exchangeRate,
    amountInputSnippets,
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

  const handleSetAmount = useCallback(
    (amount: string) => {
      if (selectedInputType === 'fiat') {
        const fiatValue = truncateDecimalPlaces(amount, 2);
        setFundAmountFiat(fiatValue);

        const calculatedCryptoValue = String(
          Number(fiatValue) * Number(exchangeRate),
        );
        const resultCryptoValue = truncateDecimalPlaces(
          calculatedCryptoValue,
          8,
        );
        setFundAmountCrypto(
          calculatedCryptoValue === '0' ? '' : resultCryptoValue,
        );
      } else {
        const truncatedValue = truncateDecimalPlaces(amount, 8);
        setFundAmountCrypto(truncatedValue);

        const calculatedFiatValue = String(
          Number(truncatedValue) / Number(exchangeRate),
        );

        const resultFiatValue = truncateDecimalPlaces(calculatedFiatValue, 2);
        setFundAmountFiat(resultFiatValue === '0' ? '' : resultFiatValue);
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [exchangeRate, setFundAmountFiat, setFundAmountCrypto, selectedInputType],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = formatDecimalInputValue(e.target.value);

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
          placeholder="0"
          data-testid="ockFundCardAmountInput"
        />

        <FundCardCurrencyLabel
          ref={currencySpanRef}
          label={selectedInputType === 'crypto' ? asset : currencyLabel}
        />
      </div>

      {!value && (
        <div className="flex w-[100%] flex-wrap items-center justify-end">
          {amountInputSnippets
            ?.filter((snippet) => snippet.type === selectedInputType)
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
          'left-[-9999px]', // Hide the span from the DOM
        )}
      >
        {value ? `${value}.` : '0.'}
      </span>
    </div>
  );
};

export default FundCardAmountInput;
