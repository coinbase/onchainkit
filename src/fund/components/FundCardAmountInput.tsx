import { isValidAmount } from '@/core/utils/isValidAmount';
import { TextInput } from '@/internal/components/TextInput';
import { useCallback, useEffect, useRef } from 'react';
import { cn, text } from '../../styles/theme';
import { useAmountInput } from '../hooks/useAmountInput';
import { useInputResize } from '../hooks/useInputResize';
import type { FundCardAmountInputPropsReact } from '../types';
import { FundCardCurrencyLabel } from './FundCardCurrencyLabel';
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
  } = useFundContext();

  const currencyOrAsset = selectedInputType === 'fiat' ? currency : asset;

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

  const { handleChange } = useAmountInput();

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
      className={cn('flex cursor-text pt-6 pb-4', className)}
    >
      <div className="flex h-14">
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

        <FundCardCurrencyLabel ref={currencySpanRef} label={currencyOrAsset} />
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
