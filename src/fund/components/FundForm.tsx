import { type ChangeEvent, useEffect, useMemo, useRef } from 'react';
import { border, cn, text } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import { useFundContext } from './FundProvider';
import { FundButton } from './FundButton';
import { FundCardHeader } from './FundCardHeader';
import { PaymentMethodSelectorDropdown } from './PaymentMethodSelectorDropdown';
import FundFormAmountInput from './FundFormAmountInput';
import FundFormAmountInputTypeSwitch from './FundFormAmountInputTypeSwitch';
import { ONRAMP_BUY_URL } from '../constants';

type Props = {
  assetSymbol: string;
  placeholder?: string | React.ReactNode;
  headerText?: string;
  buttonText?: string;
};

export function FundForm({
  assetSymbol,
  buttonText = 'Buy',
  headerText,
}: Props) {
  const { setFundAmount, fundAmount } = useFundContext();

  const fundingUrl = useMemo(() => {
    return `${ONRAMP_BUY_URL}/one-click?appId=6eceb045-266a-4940-9d22-35952496ff00&addresses={"0x3bD7802fD4C3B01dB0767e532fB96AdBa7cd5F14":["base"]}&assets=["ETH"]&presetFiatAmount=${fundAmount}`;
  }, [assetSymbol, fundAmount]);

  // https://pay.coinbase.com/buy/one-click?appId=9f59d35a-b36b-4395-ae75-560bb696bfe6&addresses={"0x3bD7802fD4C3B01dB0767e532fB96AdBa7cd5F14":["base"]}&assets=["USDC"]&presetCryptoAmount=5

  return (
    <form className="w-full">
      <FundFormAmountInput
        value={fundAmount}
        setValue={setFundAmount}
        currencySign="$"
      />

      <FundFormAmountInputTypeSwitch />

      <PaymentMethodSelectorDropdown
        paymentMethods={[
          {
            name: 'Coinbase',
            description: 'Buy with your Coinbase account',
            icon: 'coinbasePay',
          },
          {
            name: 'Apple Pay',
            description: 'Up to $500/week',
            icon: 'applePay',
          },
          {
            name: 'Debit Card',
            description: 'Up to $500/week',
            icon: 'creditCard',
          },
        ]}
      />

      <FundButton disabled={!fundAmount} hideIcon={true} text={buttonText} className="w-full" fundingUrl={fundingUrl} />
    </form>
  );
}
