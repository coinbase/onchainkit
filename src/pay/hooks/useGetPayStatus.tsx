import { useMemo } from 'react';
import { color } from '../../styles/theme';
import { usePayContext } from '../components/PayProvider';

export function useGetPayStatus() {
  const { errorMessage, lifeCycleStatus } = usePayContext();
  const isPending = lifeCycleStatus?.statusName === 'transactionPending';
  const isSuccess = lifeCycleStatus?.statusName === 'success';

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
