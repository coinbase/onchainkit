import { type ForwardedRef, forwardRef } from 'react';
import { caretDownSvg } from '../../internal/svg/caretDownSvg';
import { caretUpSvg } from '../../internal/svg/caretUpSvg';
import { border, cn, color, pressable, text } from '../../styles/theme';
import { PaymentMethodImage } from './PaymentMethodImage';
import type { PaymentMethod } from './PaymentMethodSelectorDropdown';

type Props = {
  className?: string;
  isOpen: boolean; // Determines carot icon direction
  onClick: () => void; // Button on click handler
  paymentMethod: PaymentMethod
}

export const PaymentMethodSelectorToggle = forwardRef((
  { onClick, paymentMethod, isOpen, className }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) => {
  return (
    <button
      type="button"
      className={cn(
        pressable.default,
        pressable.shadow,
        border.radius,
        border.lineDefault,
        'flex h-12 w-full items-center gap-2 px-3 py-1',
        className,
      )}
      onClick={onClick}
      ref={ref}
    >
      {paymentMethod ? (
        <>
          <div className="w-4">
            <PaymentMethodImage paymentMethod={paymentMethod} size={16} />
          </div>
          <span
            className={cn(text.headline, color.foreground, 'flex w-full')}
            data-testid="ockTokenSelectButton_Symbol"
          >
            {paymentMethod.name}
          </span>
        </>
      ) : (
        <span className={text.headline}>Select payment method</span>
      )}
      <div className="relative flex items-center justify-center">
        <div className="absolute top-0 left-0 h-4 w-4" />
        {isOpen ? caretUpSvg : caretDownSvg}
      </div>
    </button>
  );
});
