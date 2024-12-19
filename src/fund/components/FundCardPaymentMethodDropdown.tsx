import { useCallback, useRef, useState } from 'react';
import { background, border, cn } from '../../styles/theme';

import { useOutsideClick } from '@/ui-react/internal/hooks/useOutsideClick';
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
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useOutsideClick(dropdownContainerRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const handleEscKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [],
  );

  return (
    <div
      className="relative py-4"
      ref={dropdownContainerRef}
      data-testid="ockFundCardPaymentMethodDropdownContainer"
      onKeyUp={handleEscKeyPress}
    >
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
            border.radius,
            'ock-scrollbar absolute z-10 flex w-full flex-col overflow-y-hidden',
          )}
        >
          <div className={cn(background.inverse, 'overflow-y-auto p-2')}>
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
