import type { EventMetadata } from '@/fund/types';
import type { LifecycleStatus } from '@/swap/types';
import { useCallback, useEffect } from 'react';
import type { TransactionReceipt } from 'viem';
import { setupOnrampEventListeners } from '../../fund/utils/setupOnrampEventListeners';

type UseOnrampLifecycleParams = {
  updateLifecycleStatus: (status: LifecycleStatus) => void;
  maxSlippage: number;
  lifecycleStatus: LifecycleStatus;
};

export const useOnrampEventListeners = ({
  updateLifecycleStatus,
  maxSlippage,
  lifecycleStatus,
}: UseOnrampLifecycleParams) => {
  const handleOnrampEvent = useCallback(
    (data: EventMetadata) => {
      // Only update the lifecycle status if the current status is not 'transactionPending'
      // Onramp emits a 'transition_view' event multiple times
      if (
        data.eventName === 'transition_view' &&
        lifecycleStatus?.statusName !== 'transactionPending'
      ) {
        updateLifecycleStatus({
          statusName: 'transactionPending',
          statusData: {
            isMissingRequiredField: false,
            maxSlippage,
          },
        });
      }
    },
    [maxSlippage, updateLifecycleStatus, lifecycleStatus?.statusName],
  );

  const handleOnrampSuccess = useCallback(() => {
    updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        isMissingRequiredField: false,
        transactionReceipt: {} as TransactionReceipt,
        maxSlippage,
      },
    });
  }, [maxSlippage, updateLifecycleStatus]);

  const onPopupClose = useCallback(() => {
    updateLifecycleStatus({
      statusName: 'init',
      statusData: {
        isMissingRequiredField: false,
        maxSlippage,
      },
    });
  }, [updateLifecycleStatus, maxSlippage]);

  useEffect(() => {
    const unsubscribe = setupOnrampEventListeners({
      onEvent: handleOnrampEvent,
      onSuccess: handleOnrampSuccess,
    });

    return () => {
      unsubscribe();
    };
  }, [handleOnrampEvent, handleOnrampSuccess]);

  return { onPopupClose };
};
