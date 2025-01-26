import { useSendContext } from '@/wallet/components/WalletAdvancedSend/components/SendProvider';
import { TokenBalance } from '@/internal/components/TokenBalance';
import { border, cn, pressable, text } from '@/styles/theme';

export function TokenSelector() {
  const {
    tokenBalances,
    selectedToken,
    handleTokenSelection,
    handleResetTokenSelection,
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
        console.log('clicked max');
      }}
      className={cn(pressable.default, border.radius)}
    />
  );
}
