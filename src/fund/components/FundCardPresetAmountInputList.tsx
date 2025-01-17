import { useAmountInput } from '../hooks/useAmountInput';
import { FundCardPresetAmountInputItem } from './FundCardPresetAmountInputItem';
import { useFundContext } from './FundCardProvider';

export function FundCardPresetAmountInputList() {
  const { presetAmountInputs } = useFundContext();
  // Next PR will include a support for any currency
  const currency = 'USD';

  const { handleFiatChange } = useAmountInput();

  console.log('presetAmountInputs', presetAmountInputs);
  if (!presetAmountInputs) {
    return null;
  }

  return (
    <div
      data-testid="ockPresetAmountInputList"
      className="flex w-[100%] flex-wrap items-center justify-between gap-2 pt-8"
    >
      {presetAmountInputs.map((presetAmountInput, index) => (
        <FundCardPresetAmountInputItem
          // biome-ignore lint/suspicious/noArrayIndexKey: Users may supply duplicate values so making the index the key. (In this case its safe because the preset amount inputs are static and no updates to the list are expected)
          key={index}
          presetAmountInput={presetAmountInput}
          onClick={handleFiatChange}
          currency={currency}
        />
      ))}
    </div>
  );
}
