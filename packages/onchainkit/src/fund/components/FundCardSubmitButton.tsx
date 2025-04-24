'use client';
import { Spinner } from '@/internal/components/Spinner';
import { useCallback, useMemo } from 'react';
import { useFundCardFundingUrl } from '../hooks/useFundCardFundingUrl';
import { FundCardSubmitButtonProps } from '../types';
import { FundButton } from './FundButton';
import { useFundContext } from './FundCardProvider';

export function FundCardSubmitButton({
  children,
  render,
}: FundCardSubmitButtonProps) {
  const {
    fundAmountFiat,
    fundAmountCrypto,
    submitButtonState,
    setSubmitButtonState,
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

  const buttonTextContent = useMemo(() => {
    switch (submitButtonState) {
      case 'loading':
        return '';
      case 'success':
        return 'Success';
      case 'error':
        return 'Something went wrong';
      default:
        return 'Buy';
    }
  }, [submitButtonState]);

  const buttonContent = useMemo(() => {
    if (submitButtonState === 'loading') {
      return <Spinner />;
    }

    return (
      <span data-testid="ockFundButtonTextContent">{buttonTextContent}</span>
    );
  }, [submitButtonState, buttonTextContent]);

  // FundButton accepts render prop or children but not both
  if (render) {
    return (
      <FundButton
        disabled={isButtonDisabled}
        className="w-full"
        fundingUrl={fundingUrl}
        state={submitButtonState}
        onClick={handleOnClick}
        onPopupClose={handleOnPopupClose}
        fiatCurrency={currency}
        render={render}
      />
    );
  }

  return (
    <FundButton
      disabled={isButtonDisabled}
      className="w-full"
      fundingUrl={fundingUrl}
      state={submitButtonState}
      onClick={handleOnClick}
      onPopupClose={handleOnPopupClose}
      fiatCurrency={currency}
    >
      {children || buttonContent}
    </FundButton>
  );
}
