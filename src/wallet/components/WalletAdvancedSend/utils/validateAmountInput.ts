import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { parseUnits } from 'viem';

export function validateAmountInput({
  cryptoAmount,
  selectedToken,
}: {
  cryptoAmount?: string;
  selectedToken?: PortfolioTokenWithFiatValue;
}) {
  if (!cryptoAmount || !selectedToken) {
    return false;
  }

  const parsedCryptoAmount = parseUnits(cryptoAmount, selectedToken.decimals);

  return (
    parsedCryptoAmount > 0n && parsedCryptoAmount <= selectedToken.cryptoBalance
  );
}
