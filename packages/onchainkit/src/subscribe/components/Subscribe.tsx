'use client';

import { useTheme } from '@/internal/hooks/useTheme';
import { background, border, cn, color, text } from '@/styles/theme';
import type { ReactNode } from 'react';
import type { SubscribeReact } from '../types';
import { SubscribeButton } from './SubscribeButton';
import { SubscribeProvider } from './SubscribeProvider';
import { SubscribeStatus } from './SubscribeStatus';

function SubscribeContent({
  children,
  buttonText,
  disabled,
  className,
}: {
  children?: ReactNode;
  buttonText?: string;
  disabled?: boolean;
  className?: string;
}) {
  const componentTheme = useTheme();

  return (
    <div
      className={cn(
        componentTheme,
        background.default,
        color.foreground,
        'flex w-full flex-col gap-4 p-4',
        text.body,
        border.radius,
        border.lineDefault,
        className,
      )}
      data-testid="ockSubscribe"
    >
      {children || (
        <>
          <SubscribeButton text={buttonText} disabled={disabled} />
          <SubscribeStatus />
        </>
      )}
    </div>
  );
}

export function Subscribe({
  amount,
  token,
  interval,
  spender,
  subscriptionLength,
  buttonText,
  className,
  disabled = false,
  extraData,
  salt,
  onSuccess,
  onError,
  onStatus,
  children,
}: SubscribeReact & { children?: ReactNode }) {
  const validateAmount = (amount: string): string | null => {
    if (!amount || amount.trim() === '') {
      return 'Subscribe: amount is required';
    }

    const numericValue = parseFloat(amount);
    if (isNaN(numericValue) || !isFinite(numericValue)) {
      return 'Subscribe: amount must be a valid number';
    }

    if (numericValue <= 0) {
      return 'Subscribe: amount must be greater than 0';
    }

    return null;
  };

  if (process.env.NODE_ENV !== 'production') {
    const amountError = validateAmount(amount);
    if (amountError) {
      throw new Error(amountError);
    }

    if (!token) {
      throw new Error('Subscribe: token is required');
    }

    if (!interval) {
      throw new Error('Subscribe: interval is required');
    }

    if (!spender || spender === '0x0') {
      throw new Error('Subscribe: spender address is required');
    }
  } else {
    const amountError = validateAmount(amount);
    if (amountError) {
      console.error(amountError);
      return null;
    }

    if (!token) {
      console.error('Subscribe: token is required');
      return null;
    }

    if (!interval) {
      console.error('Subscribe: interval is required');
      return null;
    }

    if (!spender || spender === '0x0') {
      console.error('Subscribe: spender address is required');
      return null;
    }
  }

  return (
    <SubscribeProvider
      amount={amount}
      token={token}
      interval={interval}
      spender={spender}
      subscriptionLength={subscriptionLength}
      extraData={extraData}
      salt={salt}
      onSuccess={onSuccess}
      onError={onError}
      onStatus={onStatus}
    >
      <SubscribeContent
        buttonText={buttonText}
        disabled={disabled}
        className={className}
      >
        {children}
      </SubscribeContent>
    </SubscribeProvider>
  );
}
