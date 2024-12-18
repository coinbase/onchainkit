import { useCallback, useEffect, useRef, useState } from 'react';
import { background, border, cn } from '../../styles/theme';

import { useTheme } from '../../core-react/internal/hooks/useTheme';
import type {
  FundCardPaymentMethodDropdownPropsReact,
  PaymentMethodReact,
} from '../types';
import { FundCardPaymentMethodSelectRow } from './FundCardPaymentMethodSelectRow';
import { FundCardPaymentMethodSelectorToggle } from './FundCardPaymentMethodSelectorToggle';
import { useFundContext } from './FundCardProvider';

export function FundCardPaymentMethodDropdown({
  paymentMethods,
}: FundCardPaymentMethodDropdownPropsReact) {
  const componentTheme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const { selectedPaymentMethod, setSelectedPaymentMethod } = useFundContext();

  const handlePaymentMethodSelect = useCallback(
    (paymentMethod: PaymentMethodReact) => {
      setSelectedPaymentMethod(paymentMethod);
      setIsOpen(false);
    },
    [setSelectedPaymentMethod],
  );

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleBlur = useCallback((event: MouseEvent) => {
    const isOutsideDropdown =
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node);
    const isOutsideButton =
      buttonRef.current && !buttonRef.current.contains(event.target as Node);

    if (isOutsideDropdown && isOutsideButton) {
      setIsOpen(false);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: This useEffect is only called once
  useEffect(() => {
    setSelectedPaymentMethod(paymentMethods[0]);
  }, []);

  useEffect(() => {
    // Add event listener for outside clicks
    document.addEventListener('click', handleBlur);
    return () => {
      // Clean up the event listener
      document.removeEventListener('click', handleBlur);
    };
  }, [handleBlur]);

  return (
    <div className="relative py-4">
      <FundCardPaymentMethodSelectorToggle
        ref={buttonRef}
        onClick={handleToggle}
        isOpen={isOpen}
        paymentMethod={selectedPaymentMethod || paymentMethods[0]}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          data-testid="ockFundCardPaymentMethodDropdown"
          className={cn(
            componentTheme,
            border.radius,
            'absolute right-0 z-10 mt-1 flex max-h-80 w-full flex-col overflow-y-hidden',
            'ock-scrollbar',
          )}
        >
          <div className={cn(background.inverse, 'p-2', 'overflow-y-auto')}>
            {paymentMethods.map((paymentMethod) => (
              <FundCardPaymentMethodSelectRow
                className={cn(background.inverse, 'px-4 py-2')}
                key={paymentMethod.name}
                paymentMethod={paymentMethod}
                onClick={handlePaymentMethodSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
