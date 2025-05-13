import { useMemo } from 'react';
import { useCheckoutContext } from '../components/CheckoutProvider';

export function useGetCheckoutStatus() {
  const { errorMessage, lifecycleStatus } = useCheckoutContext();
  const isPending = lifecycleStatus?.statusName === 'pending';
  const isSuccess = lifecycleStatus?.statusName === 'success';

  return useMemo(() => {
    let label = '';
    let labelClassName: string = 'text-ock-text-foreground-muted';

    if (isPending) {
      label = 'Payment in progress...';
    }

    if (isSuccess) {
      label = 'Payment successful!';
      labelClassName = 'text-ock-text-success';
    }

    if (errorMessage) {
      label = errorMessage;
      labelClassName = 'text-ock-text-error';
    }

    return { label, labelClassName };
  }, [errorMessage, isPending, isSuccess]);
}
