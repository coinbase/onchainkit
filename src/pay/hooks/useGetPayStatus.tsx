import { useMemo } from 'react';
import { color } from '../../styles/theme';
import { usePayContext } from '../components/PayProvider';
import { PAY_LIFECYCLESTATUS } from '../constants';

export function useGetPayStatus() {
  const { errorMessage, lifecycleStatus } = usePayContext();
  const isPending = lifecycleStatus?.statusName === PAY_LIFECYCLESTATUS.PENDING;
  const isSuccess = lifecycleStatus?.statusName === PAY_LIFECYCLESTATUS.SUCCESS;

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
