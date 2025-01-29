import {
  FundCard,
  FundCardAmountInput,
  FundCardAmountInputTypeSwitch,
  FundCardHeader,
  FundCardPaymentMethodDropdown,
  FundCardPresetAmountInputList,
  FundCardSubmitButton,
} from '@/fund';
import { text } from '@/styles/theme';

export function SendFundingWallet() {
  return (
    <div className="flex flex-col items-center justify-center">
      <FundCard
        headerText="Insufficient ETH balance to send transaction. Fund your wallet to continue."
        assetSymbol="ETH"
        country="US"
        currency="USD"
        presetAmountInputs={['2', '5', '10']}
        onError={() => {}}
        onStatus={() => {}}
        onSuccess={() => {}}
        className='mt-1 w-88 border-none pt-0'
      >
        <FundCardHeader className={text.label2}/>
        <FundCardAmountInput />
        <FundCardAmountInputTypeSwitch />
        <FundCardPresetAmountInputList />
        <FundCardPaymentMethodDropdown />
        <FundCardSubmitButton />
      </FundCard>
    </div>
  );
}
