import { useCallback, useEffect } from 'react';
import { useFundContext } from '../components/FundCardProvider';
import { FUND_BUTTON_RESET_TIMEOUT } from '../constants';
import type { EventMetadata, SuccessEventData } from '../types';
import { setupOnrampEventListeners } from '../utils/setupOnrampEventListeners';

export const useFundCardSetupOnrampEventListeners = () => {
  const { setSubmitButtonState, updateLifecycleStatus } = useFundContext();

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
        setTimeout(() => {
          setSubmitButtonState('default');
        }, FUND_BUTTON_RESET_TIMEOUT);
      }
    },
    [updateLifecycleStatus, setSubmitButtonState],
  );

  const handleOnrampSuccess = useCallback(
    (data?: SuccessEventData) => {
      updateLifecycleStatus({
        statusName: 'transactionSuccess',
        statusData: data,
      });

      setSubmitButtonState('success');

      setTimeout(() => {
        setSubmitButtonState('default');
      }, FUND_BUTTON_RESET_TIMEOUT);
    },
    [updateLifecycleStatus, setSubmitButtonState],
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
