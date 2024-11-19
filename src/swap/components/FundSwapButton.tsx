import { useCallback } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import {
  cn,
  text,
  color,
  background,
  border,
  pressable,
} from '../../styles/theme';
import { useFundSwapContext } from './FundSwapProvider';

export function FundSwapButton() {
  const { setIsDropdownOpen } = useFundSwapContext();
  const isLoading = false;
  const isDisabled = false;

  const handleSubmit = useCallback(() => {
    setIsDropdownOpen(true);
  }, [setIsDropdownOpen]);

  return (
    <button
      type="button"
      className={cn(
        background.primary,
        border.radius,
        'rounded-xl',
        'px-4 py-3',
        isDisabled && pressable.disabled,
        text.headline,
      )}
      onClick={handleSubmit}
      data-testid="ockFundSwapButton_Button"
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, color.inverse)}>Buy</span>
      )}
    </button>
  );
}
