import { isValidAmount } from '@/core/utils/isValidAmount';
import { TextInput } from '@/internal/components/TextInput';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { cn, text } from '../../styles/theme';
import { useInputResize } from '../hooks/useInputResize';
import type {
  FundCardAmountInputPropsReact,
  PresetAmountInputReact,
} from '../types';
import { truncateDecimalPlaces } from '../utils/truncateDecimalPlaces';
import { FundCardCurrencyLabel } from './FundCardCurrencyLabel';
import { useFundContext } from './FundCardProvider';
import { PresetAmountInput } from './PresetAmountInput';

export const FundCardAmountInput = ({
  className,
}: FundCardAmountInputPropsReact) => {
  const {
    fundAmountFiat,
    setFundAmountFiat,
    fundAmountCrypto,
    setFundAmountCrypto,
    asset,
    selectedInputType,
    exchangeRate,
    presetAmountInputs,
  } = useFundContext();

  // Next PR will include a support for any currency
  const currencyOrAsset = selectedInputType === 'fiat' ? 'USD' : asset;

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

  const handleFiatChange = useCallback(
    (value: string) => {
      const fiatValue = truncateDecimalPlaces(value, 2);
      setFundAmountFiat(fiatValue);

      const calculatedCryptoValue = String(
        Number(fiatValue) * Number(exchangeRate),
      );
      const resultCryptoValue = truncateDecimalPlaces(calculatedCryptoValue, 8);
      setFundAmountCrypto(
        calculatedCryptoValue === '0' ? '' : resultCryptoValue,
      );
    },
    [exchangeRate, setFundAmountFiat, setFundAmountCrypto],
  );

  const handleCryptoChange = useCallback(
    (value: string) => {
      const truncatedValue = truncateDecimalPlaces(value, 8);
      setFundAmountCrypto(truncatedValue);

      const calculatedFiatValue = String(
        Number(truncatedValue) / Number(exchangeRate),
      );

      const resultFiatValue = truncateDecimalPlaces(calculatedFiatValue, 2);
      setFundAmountFiat(resultFiatValue === '0' ? '' : resultFiatValue);
    },
    [exchangeRate, setFundAmountFiat, setFundAmountCrypto],
  );

  const handleChange = useCallback(
    (value: string) => {
      if (selectedInputType === 'fiat') {
        handleFiatChange(value);
      } else {
        handleCryptoChange(value);
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [handleFiatChange, handleCryptoChange, selectedInputType],
  );

  const handlePresetAmountInputClick = useCallback(
    (presetAmountInput: PresetAmountInputReact) => {
      handleChange(presetAmountInput.value);
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

  /**
   * Filter preset amount inputs based on the selected input type.
   * If the selected input type is 'fiat', we only want to display the preset amount inputs that have a type of 'fiat'.
   * i.e [10 USD] [50 USD] [100 USD]
   *
   * If the selected input type is 'crypto', we only want to display the preset amount inputs that have a type of 'crypto'.
   * i.e [0.1 ETH] [0.2 ETH] [0.3 ETH]
   */
  const filteredPresetAmountInputs = useMemo(
    () =>
      presetAmountInputs?.filter(
        (presetAmount) => presetAmount.type === selectedInputType,
      ),
    [presetAmountInputs, selectedInputType],
  );

  return (
    <div
      ref={containerRef}
      data-testid="ockFundCardAmountInputContainer"
      className={cn('flex cursor-text py-6', className)}
    >
      <div className="flex h-20">
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
          onChange={handleChange}
          inputValidator={isValidAmount}
          ref={inputRef}
          inputMode="decimal"
          placeholder="0"
        />

        <FundCardCurrencyLabel ref={currencySpanRef} label={currencyOrAsset} />
      </div>

      {!value && filteredPresetAmountInputs && (
        <div className="flex w-[100%] flex-wrap items-center justify-end">
          {filteredPresetAmountInputs?.map((presetAmountInput, index) => (
            <PresetAmountInput
              // biome-ignore lint/suspicious/noArrayIndexKey: Users may supply duplicate values so making the index the key. (In this case its safe because the preset amount inputs are static and no updates to the list are expected)
              key={index}
              presetAmountInput={presetAmountInput}
              onClick={handlePresetAmountInputClick}
              currencyOrAsset={currencyOrAsset}
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
