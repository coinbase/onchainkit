import { useEffect } from 'react';
import { useFundContext } from '../components/FundCardProvider';
import { FUND_BUTTON_RESET_TIMEOUT } from '../constants';
import { setupOnrampEventListeners } from '../utils/setupOnrampEventListeners';

export const useFundCardSetupOnrampEventListeners = () => {
  const { setSubmitButtonState, onError, onStatus, onSuccess } =
    useFundContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only want to run this effect once
  useEffect(() => {
    const unsubscribe = setupOnrampEventListeners({
      onEvent: (event) => {
        onStatus?.(event);
        if (event.eventName === 'error') {
          setSubmitButtonState('error');

          setTimeout(() => {
            setSubmitButtonState('default');
          }, FUND_BUTTON_RESET_TIMEOUT);
        }
      },
      onExit: (event) => {
        onError?.(event);
        setSubmitButtonState('default');
        console.log('onExit', event);
      },
      onSuccess: () => {
        onSuccess?.();
        setSubmitButtonState('success');

        setTimeout(() => {
          setSubmitButtonState('default');
        }, FUND_BUTTON_RESET_TIMEOUT);
      },
    });

    return () => {
      unsubscribe();
    };
  }, []);
};
