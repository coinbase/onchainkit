import { isValidAmount } from '../../core/utils/isValidAmount';
import { TextInput } from '../../internal/components/TextInput';
import { background, cn, color } from '../../styles/theme';
import { formatAmount } from '../../swap/utils/formatAmount';
import { TokenChip } from '../../token';
import { useBuyContext } from './BuyProvider';

export function BuyAmountInput() {
  const { to, handleAmountChange } = useBuyContext();

  if (!to?.token) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex h-full items-center rounded-lg border px-2 pl-4',
        background.default,
      )}
    >
      <TextInput
        className={cn(
          'mr-2 w-full border-none font-display',
          'leading-none outline-none disabled:cursor-not-allowed',
          background.default,
          color.foreground,
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
        isPressable={false}
      />
    </div>
  );
}
