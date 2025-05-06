import { useMemo } from 'react';
import { useCheckoutContext } from '../components/CheckoutProvider';
import { CHECKOUT_LIFECYCLESTATUS } from '../constants';

export function useGetCheckoutStatus() {
  const { errorMessage, lifecycleStatus } = useCheckoutContext();
  const isPending =
    lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.PENDING;
  const isSuccess =
    lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.SUCCESS;

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
