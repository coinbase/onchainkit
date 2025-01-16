import { isApplePaySupported } from '@/buy/utils/isApplePaySupported';
import { Skeleton } from '@/internal/components/Skeleton';
import { useOutsideClick } from '@/ui-react/internal/hooks/useOutsideClick';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { background, border, cn } from '../../styles/theme';
import type {
  FundCardPaymentMethodDropdownPropsReact,
  PaymentMethod,
} from '../types';
import { FundCardPaymentMethodSelectRow } from './FundCardPaymentMethodSelectRow';
import { FundCardPaymentMethodSelectorToggle } from './FundCardPaymentMethodSelectorToggle';
import { useFundContext } from './FundCardProvider';

export function FundCardPaymentMethodDropdown({
  className,
}: FundCardPaymentMethodDropdownPropsReact) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentMethods,
    fundAmountFiat,
    paymentMethodsLoading,
  } = useFundContext();

  const filteredPaymentMethods = useMemo(() => {
    return paymentMethods.filter(
      (method) => method.id !== 'APPLE_PAY' || isApplePaySupported(),
    );
  }, [paymentMethods]);

  const isPaymentMethodDisabled = useCallback(
    (method: PaymentMethod) => {
      if (!fundAmountFiat) {
        return false;
      }

      const amount = Number(fundAmountFiat);

      return Boolean(
        (method.minAmount && amount < method.minAmount) ||
          (method.maxAmount && amount > method.maxAmount),
      );
    },
    [fundAmountFiat],
  );

  const getPaymentMethodDisabledReason = useCallback(
    (method: PaymentMethod) => {
      if (!fundAmountFiat) {
        return undefined;
      }

      const amount = Number(fundAmountFiat);

      if (method.minAmount && amount < method.minAmount) {
        return `Minimum amount of $${method.minAmount} required`;
      }

      if (method.maxAmount && amount > method.maxAmount) {
        return `Maximum amount allowed is $${method.maxAmount}`;
      }

      return undefined;
    },
    [fundAmountFiat],
  );

  // If current selected method becomes disabled, switch to Coinbase
  useEffect(() => {
    if (
      selectedPaymentMethod &&
      isPaymentMethodDisabled(selectedPaymentMethod)
    ) {
      const coinbaseMethod = paymentMethods.find((m) => m.id === '');
      if (coinbaseMethod) {
        setSelectedPaymentMethod(coinbaseMethod);
      }
    }
  }, [
    selectedPaymentMethod,
    paymentMethods,
    setSelectedPaymentMethod,
    isPaymentMethodDisabled,
  ]);

  const handlePaymentMethodSelect = useCallback(
    (paymentMethod: PaymentMethod) => {
      if (!isPaymentMethodDisabled(paymentMethod)) {
        setSelectedPaymentMethod(paymentMethod);
        setIsOpen(false);
      }
    },
    [setSelectedPaymentMethod, isPaymentMethodDisabled],
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
      className={cn('relative py-4', className)}
      ref={dropdownContainerRef}
      data-testid="ockFundCardPaymentMethodDropdownContainer"
      onKeyUp={handleEscKeyPress}
    >
      {paymentMethodsLoading ? (
        <Skeleton className="h-12 w-full" />
      ) : (
        <FundCardPaymentMethodSelectorToggle
          ref={buttonRef}
          onClick={handleToggle}
          isOpen={isOpen}
          paymentMethod={selectedPaymentMethod || filteredPaymentMethods[0]}
        />
      )}
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
            {filteredPaymentMethods.map((paymentMethod) => {
              const isDisabled = isPaymentMethodDisabled(paymentMethod);
              return (
                <FundCardPaymentMethodSelectRow
                  key={paymentMethod.name}
                  testId={`ockFundCardPaymentMethodSelectRow__${paymentMethod.id}`}
                  paymentMethod={paymentMethod}
                  onClick={handlePaymentMethodSelect}
                  disabled={isDisabled}
                  disabledReason={
                    isDisabled
                      ? getPaymentMethodDisabledReason(paymentMethod)
                      : undefined
                  }
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
