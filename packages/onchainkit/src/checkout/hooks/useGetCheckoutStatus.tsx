import { useMemo } from 'react';
import { useCheckoutContext } from '../components/CheckoutProvider';
import { CHECKOUT_LIFECYCLE_STATUS } from '../constants';

export function useGetCheckoutStatus() {
  const { errorMessage, lifecycleStatus } = useCheckoutContext();
  const isPending =
    lifecycleStatus?.statusName === CHECKOUT_LIFECYCLE_STATUS.PENDING;
  const isSuccess =
    lifecycleStatus?.statusName === CHECKOUT_LIFECYCLE_STATUS.SUCCESS;

  return useMemo(() => {
    let label = '';
    let labelClassName: string = 'text-ock-foreground-muted';

    if (isPending) {
      label = 'Payment in progress...';
    }

    if (isSuccess) {
      label = 'Payment successful!';
      labelClassName = 'text-ock-success';
    }

    if (errorMessage) {
      label = errorMessage;
      labelClassName = 'text-ock-error';
    }

    return { label, labelClassName };
  }, [errorMessage, isPending, isSuccess]);
}
