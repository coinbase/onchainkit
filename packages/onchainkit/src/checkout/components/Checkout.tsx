'use client';

import { useIsMounted } from '../../internal/hooks/useIsMounted';
import { cn } from '../../styles/theme';
import type { CheckoutProps } from '../types';
import { CheckoutProvider } from './CheckoutProvider';

/**
 * @deprecated The <Checkout /> component and its related components and hooks are deprecated
 * and will be removed in a future version. We recommend looking at Base Pay for similar functionality.
 * @see {@link https://docs.base.org/base-account/guides/accept-payments}
 */
export function Checkout({
  chargeHandler,
  children,
  className,
  isSponsored,
  onStatus,
  productId,
}: CheckoutProps) {
  const isMounted = useIsMounted();
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
      <div className={cn('flex w-full flex-col gap-2', className)}>
        {children}
      </div>
    </CheckoutProvider>
  );
}
