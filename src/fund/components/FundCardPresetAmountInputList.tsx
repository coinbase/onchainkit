import { useAmountInput } from '../hooks/useAmountInput';
import { FundCardPresetAmountInputItem } from './FundCardPresetAmountInputItem';
import { useFundContext } from './FundCardProvider';

export function FundCardPresetAmountInputList() {
  const { presetAmountInputs } = useFundContext();
  const { handleFiatChange } = useAmountInput();

  if (!presetAmountInputs) {
    return null;
  }

  return (
    <div
      data-testid="ockPresetAmountInputList"
      className="flex w-[100%] flex-wrap items-center justify-between gap-2 pt-8"
    >
      {presetAmountInputs.map((amount, index) => (
        <FundCardPresetAmountInputItem
          // biome-ignore lint/suspicious/noArrayIndexKey: Preset amounts are static
          key={index}
          presetAmountInput={amount}
          onClick={handleFiatChange}
          currency="USD" // Will be configurable in next PR
        />
      ))}
    </div>
  );
}
