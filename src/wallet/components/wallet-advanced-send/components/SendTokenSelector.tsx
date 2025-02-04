'use client';

import { border, cn, color, pressable, text } from '@/styles/theme';
import { TokenBalance } from '@/token';
import { formatUnits } from 'viem';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import type { SendTokenSelectorProps } from '../types';

export function SendTokenSelector({
  selectedToken,
  handleTokenSelection,
  handleResetTokenSelection,
  setSelectedInputType,
  handleCryptoAmountChange,
  handleFiatAmountChange,
  classNames,
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
              classNames={{
                container: cn(
                  pressable.default,
                  border.radius,
                  classNames?.container,
                ),
                ...classNames,
              }}
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
      classNames={{
        container: cn(
          pressable.alternate,
          border.radius,
          classNames?.container,
        ),
        ...classNames,
      }}
    />
  );
}
