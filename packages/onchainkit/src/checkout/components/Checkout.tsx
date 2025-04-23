'use client';

import { useIsMounted } from '../../internal/hooks/useIsMounted';
import { useTheme } from '../../internal/hooks/useTheme';
import { cn } from '../../styles/theme';
import type { CheckoutReact } from '../types';
import { CheckoutProvider } from './CheckoutProvider';

export function Checkout({
  chargeHandler,
  children,
  className,
  isSponsored,
  onStatus,
  productId,
}: CheckoutReact) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();
  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <CheckoutProvider
      chargeHandler={chargeHandler}
      isSponsored={isSponsored}
      onStatus={onStatus}
      productId={productId}
    >
      <div
        className={cn(componentTheme, 'flex w-full flex-col gap-2', className)}
      >
        {children}
      </div>
    </CheckoutProvider>
  );
}
