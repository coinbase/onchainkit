'use client';

import { cn, text } from '../../styles/theme';
import { useGetCheckoutStatus } from '../hooks/useGetCheckoutStatus';
import type { CheckoutStatusProps } from '../types';

/**
 * @deprecated The <Checkout /> component and its related components and hooks are deprecated
 * and will be removed in a future version. We recommend looking at Base Pay for similar functionality.
 * @see {@link https://docs.base.org/base-account/guides/accept-payments}
 */
export function CheckoutStatus({ className }: CheckoutStatusProps) {
  const { label, labelClassName } = useGetCheckoutStatus();

  return (
    <div className={cn('flex justify-between', className)}>
      <div className={text.label2}>
        <p className={labelClassName}>{label}</p>
      </div>
    </div>
  );
}
