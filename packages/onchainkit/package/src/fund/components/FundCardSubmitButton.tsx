'use client';
import { useCallback, useMemo } from 'react';
import { useFundCardFundingUrl } from '../hooks/useFundCardFundingUrl';
import { FundButton } from './FundButton';
import { useFundContext } from './FundCardProvider';

export function FundCardSubmitButton() {
  const {
    fundAmountFiat,
    fundAmountCrypto,
    submitButtonState,
    setSubmitButtonState,
    buttonText,
    currency,
    updateLifecycleStatus,
  } = useFundContext();

  const fundingUrl = useFundCardFundingUrl();

  const handleOnClick = useCallback(
    () => setSubmitButtonState('loading'),
    [setSubmitButtonState],
  );

  const handleOnPopupClose = useCallback(() => {
    updateLifecycleStatus({ statusName: 'exit', statusData: undefined });
    setSubmitButtonState('default');
  }, [updateLifecycleStatus, setSubmitButtonState]);

  const isButtonDisabled = useMemo(
    () =>
      (!fundAmountFiat || Number(fundAmountCrypto) === 0) &&
      (!fundAmountCrypto || Number(fundAmountFiat) === 0),
    [fundAmountCrypto, fundAmountFiat],
  );

  return (
    <FundButton
      disabled={isButtonDisabled}
      hideIcon={submitButtonState === 'default'}
      text={buttonText}
      className="w-full"
      fundingUrl={fundingUrl}
      state={submitButtonState}
      onClick={handleOnClick}
      onPopupClose={handleOnPopupClose}
      fiatCurrency={currency}
    />
  );
}
