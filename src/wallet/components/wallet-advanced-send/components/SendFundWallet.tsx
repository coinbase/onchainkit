import {
  FundCard,
  FundCardAmountInput,
  FundCardAmountInputTypeSwitch,
  FundCardPaymentMethodDropdown,
  FundCardPresetAmountInputList,
  FundCardSubmitButton,
} from '@/fund';
import { cn, color, text } from '@/styles/theme';
import type { SendFundingWalletProps } from '../types';

export function SendFundWallet({
  onError,
  onStatus,
  onSuccess,
  className,
  subtitleClassName,
}: SendFundingWalletProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-between', className)}
      data-testid="ockSendFundWallet"
    >
      <div
        className={cn(text.label2, color.foregroundMuted, subtitleClassName)}
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
