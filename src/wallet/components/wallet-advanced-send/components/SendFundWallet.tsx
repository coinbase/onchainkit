import {
  FundCard,
  FundCardAmountInput,
  FundCardAmountInputTypeSwitch,
  FundCardPaymentMethodDropdown,
  FundCardPresetAmountInputList,
  FundCardSubmitButton,
} from '@/fund';
import { cn, color, text } from '@/styles/theme';

type SendFundWalletProps = {
  onError?: () => void;
  onStatus?: () => void;
  onSuccess?: () => void;
  classNames?: {
    container?: string;
    subtitle?: string;
    fundCard?: string;
  };
};

export function SendFundWallet({
  onError,
  onStatus,
  onSuccess,
  classNames,
}: SendFundWalletProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between',
        classNames?.container,
      )}
      data-testid="ockSendFundWallet"
    >
      <div
        className={cn(text.label2, color.foregroundMuted, classNames?.subtitle)}
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
        className={cn('mt-3 w-88 border-none py-0', classNames?.fundCard)}
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
