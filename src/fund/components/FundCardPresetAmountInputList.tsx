import { useAmountInput } from '../hooks/useAmountInput';
import { FundCardPresetAmountInputItem } from './FundCardPresetAmountInputItem';
import { useFundContext } from './FundCardProvider';

export function FundCardPresetAmountInputList() {
  const { presetAmountInputs, currency } = useFundContext();
  const { handleFiatChange } = useAmountInput();

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
          // biome-ignore lint/suspicious/noArrayIndexKey: Preset amounts are static
          key={index}
          presetAmountInput={amount}
          onClick={handleFiatChange}
          currency={currency}
        />
      ))}
    </div>
  );
}
