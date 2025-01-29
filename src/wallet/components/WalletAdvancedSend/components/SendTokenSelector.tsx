import { TokenBalance } from '@/internal/components/TokenBalance';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useSendContext } from './SendProvider';

export function SendTokenSelector() {
  const {
    tokenBalances,
    selectedToken,
    handleTokenSelection,
    handleResetTokenSelection,
    setSelectedInputType,
    handleCryptoAmountChange,
    handleFiatAmountChange,
  } = useSendContext();

  if (!selectedToken) {
    return (
      <div className="mt-4 flex max-h-80 flex-col gap-2">
        <span className={cn(text.caption, color.foregroundMuted, 'uppercase')}>
          Select a token
        </span>
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
      subtitle="available"
      onClick={handleResetTokenSelection}
      showAction={true}
      onActionPress={() => {
        setSelectedInputType('crypto');
        handleFiatAmountChange(String(selectedToken.fiatBalance));
        handleCryptoAmountChange(
          String(
            Number(selectedToken.cryptoBalance) /
              10 ** Number(selectedToken.decimals),
          ),
        );
      }}
      className={cn(pressable.alternate, border.radius, 'p-2')}
    />
  );
}
