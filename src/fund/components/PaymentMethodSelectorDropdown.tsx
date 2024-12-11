import {  useCallback, useRef, useState } from 'react';
import { background, border, cn } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import { PaymentMethodSelectRow } from './PaymentMethodSelectRow';
import { PaymentMethodSelectorToggle } from './PaymentMethodSelectorToggle';
import { useFundContext } from './FundProvider';

export type PaymentMethod = {
  id: 'CRYPTO_ACCOUNT' | 'FIAT_WALLET' | 'CARD' | 'ACH_BANK_ACCOUNT' | 'APPLE_PAY';
  name: string;
  description: string;
  icon: string;
};

type Props = {
  paymentMethods: PaymentMethod[]
}

export function PaymentMethodSelectorDropdown({
  paymentMethods,
}: Props) {
  const componentTheme = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const {  setFundAmount, fundAmount, selectedPaymentMethod, setSelectedPaymentMethod } = useFundContext();

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* v8 ignore next 11 */
  const handleBlur = useCallback((event: { target: Node; }) => {
    const isOutsideDropdown =
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node);
    const isOutsideButton =
      buttonRef.current && !buttonRef.current.contains(event.target as Node);

    if (isOutsideDropdown && isOutsideButton) {
      setIsOpen(false);
    }
  }, []);

  // useEffect(() => {
  //   // NOTE: this ensures that handleBlur doesn't get called on initial mount
  //   //       We need to use non-div elements to properly handle onblur events
  //   setTimeout(() => {
  //     document.addEventListener('click', handleBlur);
  //   }, 0);

  //   return () => {
  //     document.removeEventListener('click', handleBlur);
  //   };
  // }, [handleBlur]);

  return (
    <div className='relative py-4' onBlur={handleBlur}>

      <PaymentMethodSelectorToggle
        ref={buttonRef}
        onClick={handleToggle}
        isOpen={isOpen}
        paymentMethod={selectedPaymentMethod || paymentMethods[0]}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          data-testid="ockTokenSelectDropdown_List"
          className={cn(
            componentTheme,
            border.radius,
            'absolute right-0 z-10 mt-1 flex max-h-80 w-full flex-col overflow-y-hidden',
            'ock-scrollbar',
          )}
        >
          <div className={cn(background.inverse, 'p-2', 'overflow-y-auto')}>

            {paymentMethods.map((paymentMethod) => (
              <PaymentMethodSelectRow
                className={cn(background.inverse, 'px-4 py-2')}
                key={paymentMethod.name}
                paymentMethod={paymentMethod}
                onClick={(paymentMethod: PaymentMethod) => {
                  setSelectedPaymentMethod(paymentMethod);
                  handleToggle();
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
