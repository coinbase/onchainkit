import { useFundCardFundingUrl } from '../hooks/useFundCardFundingUrl';
import { useFundCardSetupOnrampEventListeners } from '../hooks/useFundCardSetupOnrampEventListeners';
import { FundButton } from './FundButton';
import { useFundContext } from './FundCardProvider';

export function FundCardSubmitButton() {
  const {
    fundAmountFiat,
    fundAmountCrypto,
    submitButtonState,
    setSubmitButtonState,
    buttonText,
  } = useFundContext();

  const fundingUrl = useFundCardFundingUrl();

  // Setup event listeners for the onramp
  useFundCardSetupOnrampEventListeners();

  return (
    <FundButton
      disabled={!fundAmountFiat && !fundAmountCrypto}
      hideIcon={submitButtonState === 'default'}
      text={buttonText}
      className="w-full"
      fundingUrl={fundingUrl}
      state={submitButtonState}
      onClick={() => setSubmitButtonState('loading')}
      onPopupClose={() => setSubmitButtonState('default')}
    />
  );
}
