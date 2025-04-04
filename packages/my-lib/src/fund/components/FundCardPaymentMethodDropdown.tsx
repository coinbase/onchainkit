'use client';
import { isApplePaySupported } from '@/buy/utils/isApplePaySupported';
import { Skeleton } from '@/internal/components/Skeleton';
import { useOutsideClick } from '@/internal/hooks/useOutsideClick';
import { formatFiatAmount } from '@/internal/utils/formatFiatAmount';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { FundEvent } from '../../core/analytics/types';
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
    isPaymentMethodsLoading,
    currency,
  } = useFundContext();

  const { sendAnalytics } = useAnalytics();

  const filteredPaymentMethods = useMemo(() => {
    return paymentMethods.filter(
      (method) => method.id !== 'APPLE_PAY' || isApplePaySupported(),
    );
  }, [paymentMethods]);

  const getPaymentMethodDisabledReason = useCallback(
    (method: PaymentMethod) => {
      const amount = Number(fundAmountFiat);

      if (method.minAmount && amount < method.minAmount) {
        return `Minimum amount of ${formatFiatAmount({
          amount: method.minAmount,
          currency: currency,
          minimumFractionDigits: 0,
        })} required`;
      }

      if (method.maxAmount && amount > method.maxAmount) {
        return `Maximum amount allowed is ${formatFiatAmount({
          amount: method.maxAmount,
          currency: currency,
          minimumFractionDigits: 0,
        })}`;
      }

      return undefined;
    },
    [fundAmountFiat, currency],
  );

  const isPaymentMethodDisabled = useCallback(
    (method: PaymentMethod) => {
      if (!fundAmountFiat) {
        return false;
      }

      return Boolean(getPaymentMethodDisabledReason(method));
    },
    [fundAmountFiat, getPaymentMethodDisabledReason],
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
        sendAnalytics(FundEvent.FundOptionSelected, {
          option: paymentMethod.id,
        });
        setSelectedPaymentMethod(paymentMethod);
        setIsOpen(false);
      }
    },
    [setSelectedPaymentMethod, isPaymentMethodDisabled, sendAnalytics],
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

  const paymentMethod = selectedPaymentMethod || filteredPaymentMethods[0];

  return (
    <div
      className={cn('relative py-4', className)}
      ref={dropdownContainerRef}
      data-testid="ockFundCardPaymentMethodDropdownContainer"
      onKeyUp={handleEscKeyPress}
    >
      {isPaymentMethodsLoading || !paymentMethod ? (
        <Skeleton className="h-12 w-full" />
      ) : (
        <FundCardPaymentMethodSelectorToggle
          ref={buttonRef}
          onClick={handleToggle}
          isOpen={isOpen}
          paymentMethod={paymentMethod}
        />
      )}
      {isOpen && (
        <div
          ref={dropdownRef}
          data-testid="ockFundCardPaymentMethodDropdown"
          className={cn(
            border.radius,
            border.lineDefault,
            'ock-scrollbar absolute z-10 mt-2 flex w-full flex-col overflow-y-hidden',
          )}
        >
          <div className={cn(background.default, 'overflow-y-auto p-2')}>
            {filteredPaymentMethods.map((paymentMethod) => {
              const isDisabled = isPaymentMethodDisabled(paymentMethod);
              return (
                <FundCardPaymentMethodSelectRow
                  key={paymentMethod.name}
                  testId={`ockFundCardPaymentMethodSelectRow__${paymentMethod.id}`}
                  paymentMethod={paymentMethod}
                  onClick={handlePaymentMethodSelect}
                  disabled={isDisabled}
                  disabledReason={getPaymentMethodDisabledReason(paymentMethod)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
