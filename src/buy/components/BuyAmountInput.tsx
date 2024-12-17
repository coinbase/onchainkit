import { isValidAmount } from '../../core/utils/isValidAmount';
import { TextInput } from '../../internal/components/TextInput';
import { cn, color } from '../../styles/theme';
import { formatAmount } from '../../swap/utils/formatAmount';
import { TokenChip } from '../../token';
import { useBuyContext } from './BuyProvider';

export function BuyAmountInput() {
  const { to, handleAmountChange } = useBuyContext();

  if (!to?.token) {
    return null;
  }

  return (
    <div className="flex h-full items-center rounded-lg border px-4">
      <TextInput
        className={cn(
          'mr-2 w-full border-[none] bg-transparent font-display',
          'leading-none outline-none',
        )}
        placeholder="0.0"
        delayMs={1000}
        value={formatAmount(to.amount)}
        setValue={to.setAmount}
        disabled={to.loading}
        onChange={handleAmountChange}
        inputValidator={isValidAmount}
      />
      <TokenChip
        className={cn(color.foreground, 'rounded-md')}
        token={to.token}
      />
    </div>
  );
}
