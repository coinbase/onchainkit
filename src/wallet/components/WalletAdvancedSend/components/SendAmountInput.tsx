import { AmountInput } from '@/internal/components/AmountInput/AmountInput';
import { AmountInputTypeSwitch } from '@/internal/components/AmountInput/AmountInputTypeSwitch';
// import { cn } from '@/styles/theme';
import { useSendContext } from '@/wallet/components/WalletAdvancedSend/components/SendProvider';

export function SendAmountInput({ className }: { className?: string }) {
  const {
    fiatAmount,
    cryptoAmount,
    selectedToken,
    setFiatAmount,
    setCryptoAmount,
    exchangeRate,
    selectedInputType,
    setSelectedInputType,
  } = useSendContext();

  return (
    <div>
      <AmountInput
        fiatAmount={fiatAmount ?? ''}
        cryptoAmount={cryptoAmount ?? ''}
        asset={selectedToken?.symbol ?? ''}
        currency={'USD'}
        selectedInputType={selectedInputType}
        className={className}
        setFiatAmount={setFiatAmount}
        setCryptoAmount={setCryptoAmount}
        exchangeRate={String(exchangeRate)}
      />
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
    </div>
  );
}
