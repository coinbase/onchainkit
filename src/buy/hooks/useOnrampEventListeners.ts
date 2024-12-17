import type { EventMetadata } from '@/fund/types';
import type { LifecycleStatus } from '@/swap/types';
import { useEffect, useCallback } from 'react';
import { setupOnrampEventListeners } from '../../fund/utils/setupOnrampEventListeners';

type UseOnrampLifecycleParams = {
  updateLifecycleStatus: (status: LifecycleStatus) => void;
  maxSlippage: number;
};

export const useOnrampEventListeners = ({
  updateLifecycleStatus,
  maxSlippage,
}: UseOnrampLifecycleParams) => {
  const handleOnrampEvent = useCallback(
    (data: EventMetadata) => {
      if (data.eventName === 'transition_view') {
        updateLifecycleStatus({
          statusName: 'transactionPending',
          statusData: {
            isMissingRequiredField: false,
            maxSlippage,
          },
        });
      }
    },
    [updateLifecycleStatus],
  );

  const handleOnrampSuccess = useCallback(() => {
    updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        isMissingRequiredField: false,
        transactionReceipt: undefined,
        maxSlippage,
      },
    });
  }, [updateLifecycleStatus]);

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
  }, [setupOnrampEventListeners, handleOnrampEvent, handleOnrampSuccess]);

  return { onPopupClose };
};
