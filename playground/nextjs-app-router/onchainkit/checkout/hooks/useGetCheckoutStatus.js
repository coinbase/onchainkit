import { useMemo } from 'react';
import { color } from '../../styles/theme.js';
import { useCheckoutContext } from '../components/CheckoutProvider.js';
import { CHECKOUT_LIFECYCLESTATUS } from '../constants.js';
function useGetCheckoutStatus() {
  const _useCheckoutContext = useCheckoutContext(),
    errorMessage = _useCheckoutContext.errorMessage,
    lifecycleStatus = _useCheckoutContext.lifecycleStatus;
  const isPending = lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.PENDING;
  const isSuccess = lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.SUCCESS;
  return useMemo(() => {
    let label = '';
    let labelClassName = color.foregroundMuted;
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
    return {
      label,
      labelClassName
    };
  }, [errorMessage, isPending, isSuccess]);
}
export { useGetCheckoutStatus };
//# sourceMappingURL=useGetCheckoutStatus.js.map
