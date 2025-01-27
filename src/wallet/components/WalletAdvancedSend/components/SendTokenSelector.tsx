import { useSendContext } from '@/wallet/components/WalletAdvancedSend/components/SendProvider';
import { TokenBalance } from '@/internal/components/TokenBalance';
import { border, cn, pressable, text } from '@/styles/theme';

export function SendTokenSelector() {
  const {
    tokenBalances,
    selectedToken,
    handleTokenSelection,
    handleResetTokenSelection,
    setSelectedInputType,
    setCryptoAmount,
    setFiatAmount,
  } = useSendContext();

  if (!selectedToken) {
    return (
      <div className="mt-4 flex max-h-80 flex-col gap-2">
        <span className={cn(text.caption, 'uppercase')}>Select a token</span>
        <div className="scrollbar-hidden overflow-y-auto">
          {tokenBalances?.map((token) => (
            <TokenBalance
              key={token.address}
              token={token}
              onClick={handleTokenSelection}
              subtitle=""
              className={cn(pressable.default, border.radius)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <TokenBalance
      token={selectedToken}
      showImage={true}
      subtitle="Available to send"
      onClick={handleResetTokenSelection}
      showAction={true}
      onActionPress={() => {
        setSelectedInputType('crypto');
        setFiatAmount(String(selectedToken.fiatBalance));
        setCryptoAmount(
          String(
            Number(selectedToken.cryptoBalance) /
              10 ** Number(selectedToken.decimals),
          ),
        );
      }}
      className={cn(pressable.alternate, border.radius)}
    />
  );
}
