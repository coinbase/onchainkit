import {
  FundCard,
  FundCardAmountInput,
  FundCardAmountInputTypeSwitch,
  FundCardPaymentMethodDropdown,
  FundCardPresetAmountInputList,
  FundCardSubmitButton,
} from '@/fund';
import { cn, color, text } from '@/styles/theme';

type SendFundingWalletProps = {
  onError?: () => void;
  onStatus?: () => void;
  onSuccess?: () => void;
  className?: string;
};

export function SendFundWallet({
  onError,
  onStatus,
  onSuccess,
  className,
}: SendFundingWalletProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-between', className)}
    >
      <div
        className={cn(text.label2, color.foregroundMuted)}
        data-testid="ockSendFundingWalletHeader"
      >
        Insufficient ETH balance to send transaction. Fund your wallet to
        continue.
      </div>
      <FundCard
        assetSymbol="ETH"
        country="US"
        currency="USD"
        presetAmountInputs={['2', '5', '10']}
        onError={onError}
        onStatus={onStatus}
        onSuccess={onSuccess}
        className={cn('mt-3 w-88 border-none py-0', className)}
      >
        <FundCardAmountInput />
        <FundCardAmountInputTypeSwitch />
        <FundCardPresetAmountInputList />
        <FundCardPaymentMethodDropdown />
        <FundCardSubmitButton />
      </FundCard>
    </div>
  );
}
