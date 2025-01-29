'use client';

import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { TokenBalance } from '@/internal/components/TokenBalance';
import { border, cn, color, pressable, text } from '@/styles/theme';
import type { Dispatch, SetStateAction } from 'react';

type SendTokenSelectorProps = {
  selectedToken: PortfolioTokenWithFiatValue | null;
  tokenBalances: PortfolioTokenWithFiatValue[] | undefined;
  handleTokenSelection: (token: PortfolioTokenWithFiatValue) => void;
  handleResetTokenSelection: () => void;
  setSelectedInputType: Dispatch<SetStateAction<'crypto' | 'fiat'>>;
  handleCryptoAmountChange: (value: string) => void;
  handleFiatAmountChange: (value: string) => void;
};
export function SendTokenSelector({
  selectedToken,
  tokenBalances,
  handleTokenSelection,
  handleResetTokenSelection,
  setSelectedInputType,
  handleCryptoAmountChange,
  handleFiatAmountChange,
}: SendTokenSelectorProps) {
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
