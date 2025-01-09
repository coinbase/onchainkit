'use client';

import { cn, text } from '../../styles/theme';
import { useGetCheckoutStatus } from '../hooks/useGetCheckoutStatus';
import type { CheckoutStatusReact } from '../types';

export function CheckoutStatus({ className }: CheckoutStatusReact) {
  const { label, labelClassName } = useGetCheckoutStatus();

  return (
    <div className={cn('flex justify-between', className)}>
      <div className={text.label2}>
        <p className={labelClassName}>{label}</p>
      </div>
    </div>
  );
}
