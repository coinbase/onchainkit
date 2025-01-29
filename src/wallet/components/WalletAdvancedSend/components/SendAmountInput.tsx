import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { AmountInput } from '@/internal/components/AmountInput/AmountInput';
import { AmountInputTypeSwitch } from '@/internal/components/AmountInput/AmountInputTypeSwitch';
import { Skeleton } from '@/internal/components/Skeleton';
import { cn, color, text } from '@/styles/theme';
import { useSendContext } from '@/wallet/components/WalletAdvancedSend/components/SendProvider';

export function SendAmountInput({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) {
  const {
    selectedToken,
    cryptoAmount,
    handleCryptoAmountChange,
    fiatAmount,
    handleFiatAmountChange,
    selectedInputType,
    setSelectedInputType,
    exchangeRate,
    exchangeRateLoading,
  } = useSendContext();

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
      <div className="flex h-full w-full flex-col justify-center">
        <AmountInput
          fiatAmount={fiatAmount ?? ''}
          cryptoAmount={cryptoAmount ?? ''}
          asset={selectedToken?.symbol ?? ''}
          currency={'USD'}
          selectedInputType={selectedInputType}
          className={className}
          textClassName={textClassName}
          setFiatAmount={handleFiatAmountChange}
          setCryptoAmount={handleCryptoAmountChange}
          exchangeRate={String(exchangeRate)}
        />

        <SendAmountInputTypeSwitch
          selectedToken={selectedToken ?? null}
          fiatAmount={fiatAmount ?? ''}
          cryptoAmount={cryptoAmount ?? ''}
          selectedInputType={selectedInputType}
          setSelectedInputType={setSelectedInputType}
          exchangeRate={exchangeRate}
          exchangeRateLoading={exchangeRateLoading}
        />
      </div>
    </div>
  );
}

function SendAmountInputTypeSwitch({
  exchangeRateLoading,
  exchangeRate,
  selectedToken,
  fiatAmount,
  cryptoAmount,
  selectedInputType,
  setSelectedInputType,
}: {
  exchangeRateLoading: boolean;
  exchangeRate: number;
  selectedToken: PortfolioTokenWithFiatValue | null;
  fiatAmount: string;
  cryptoAmount: string;
  selectedInputType: 'fiat' | 'crypto';
  setSelectedInputType: (type: 'fiat' | 'crypto') => void;
}) {
  if (exchangeRateLoading) {
    return <Skeleton className="h-[1.625rem]" />;
  }

  if (exchangeRate <= 0) {
    return (
      <div className={cn(text.caption, color.foregroundMuted, 'h-[1.625rem]')}>
        Exchange rate unavailable
      </div>
    );
  }

  return (
    <AmountInputTypeSwitch
      asset={selectedToken?.symbol ?? ''}
      fiatAmount={fiatAmount ?? ''}
      cryptoAmount={cryptoAmount ?? ''}
      exchangeRate={exchangeRate}
      exchangeRateLoading={false}
      currency={'USD'}
      selectedInputType={selectedInputType}
      setSelectedInputType={setSelectedInputType}
    />
  );
}
