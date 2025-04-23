import { useMemo } from 'react';
import { color } from '../../styles/theme';
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
    let labelClassName: string = color.foregroundMuted;

    if (isPending) {
      label = 'Payment in progress...';
    }

    if (isSuccess) {
      label = 'Payment successful!';
      labelClassName = color.success;
    }

    if (errorMessage) {
      label = errorMessage;
      labelClassName = color.error;
    }

    return { label, labelClassName };
  }, [errorMessage, isPending, isSuccess]);
}
