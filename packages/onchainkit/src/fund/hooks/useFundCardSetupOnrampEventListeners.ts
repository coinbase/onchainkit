import { useCallback, useEffect, useRef } from 'react';
import { useFundContext } from '../components/FundCardProvider';
import { FUND_BUTTON_RESET_TIMEOUT } from '../constants';
import type { EventMetadata, SuccessEventData } from '../types';
import { setupOnrampEventListeners } from '../utils/setupOnrampEventListeners';

export const useFundCardSetupOnrampEventListeners = () => {
  const { setSubmitButtonState, updateLifecycleStatus } = useFundContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleFundButtonReset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSubmitButtonState('default');
    }, FUND_BUTTON_RESET_TIMEOUT);
  }, [setSubmitButtonState]);

  const handleOnrampEvent = useCallback(
    (data: EventMetadata) => {
      if (data.eventName === 'transition_view') {
        updateLifecycleStatus({
          statusName: 'transactionPending',
          statusData: undefined,
        });
      } else if (data.eventName === 'error') {
        updateLifecycleStatus({
          statusName: 'error',
          statusData: data.error,
        });

        setSubmitButtonState('error');
        scheduleFundButtonReset();
      }
    },
    [updateLifecycleStatus, setSubmitButtonState, scheduleFundButtonReset],
  );

  const handleOnrampSuccess = useCallback(
    (data?: SuccessEventData) => {
      updateLifecycleStatus({
        statusName: 'transactionSuccess',
        statusData: data,
      });

      setSubmitButtonState('success');
      scheduleFundButtonReset();
    },
    [updateLifecycleStatus, setSubmitButtonState, scheduleFundButtonReset],
  );

  const handleOnrampExit = useCallback(() => {
    setSubmitButtonState('default');

    updateLifecycleStatus({
      statusName: 'exit',
      statusData: undefined,
    });
  }, [updateLifecycleStatus, setSubmitButtonState]);

  useEffect(() => {
    const unsubscribe = setupOnrampEventListeners({
      onEvent: handleOnrampEvent,
      onExit: handleOnrampExit,
      onSuccess: handleOnrampSuccess,
    });

    return () => {
      unsubscribe();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
