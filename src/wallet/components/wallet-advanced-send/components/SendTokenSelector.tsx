'use client';

import { TokenBalance } from '@/token';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { formatUnits } from 'viem';
import type { SendTokenSelectorProps } from '../types';
import { useWalletAdvancedContext } from '@/wallet/components/WalletAdvancedProvider';

export function SendTokenSelector({
  selectedToken,
  handleTokenSelection,
  handleResetTokenSelection,
  setSelectedInputType,
  handleCryptoAmountChange,
  handleFiatAmountChange,
}: SendTokenSelectorProps) {
  const { tokenBalances } = useWalletAdvancedContext();

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
            formatUnits(
              BigInt(selectedToken.cryptoBalance),
              selectedToken.decimals,
            ),
          ),
        );
      }}
      className={cn(pressable.alternate, border.radius, 'p-2')}
    />
  );
}
