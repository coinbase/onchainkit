import { memo } from 'react';
import { cn, color, pressable, text } from '../../styles/theme';
import { useTheme } from '../../useTheme';

import type { PaymentMethod } from './PaymentMethodSelectorDropdown';
import { PaymentMethodImage } from './PaymentMethodImage';

type Props = {
  className?: string;
  paymentMethod: PaymentMethod;
  onClick?: (paymentMethod: PaymentMethod) => void;
  hideImage?: boolean;
  hideDescription?: boolean;
}

export const PaymentMethodSelectRow = memo(({
  className,
  paymentMethod,
  onClick,
  hideImage,
  hideDescription,
}: Props) => {
  const componentTheme = useTheme();

  return (
    <button
      data-testid="ockTokenRow_Container"
      type="button"
      className={cn(
        componentTheme,
        pressable.default,
        'ock-border-radius flex w-full items-center justify-between px-2 py-1',
        className,
      )}
      onClick={() => onClick?.(paymentMethod)}
    >
      <span className="flex items-center gap-3">
        {!hideImage && <PaymentMethodImage paymentMethod={paymentMethod} size={28} />}
        <span className="flex flex-col items-start">
          <span className={cn(text.headline)}>{paymentMethod.name}</span>
          {!hideDescription && (
            <span className={cn(text.body, color.foregroundMuted)}>
              {paymentMethod.description}
            </span>
          )}
        </span>
      </span>
    </button>
  );
});
