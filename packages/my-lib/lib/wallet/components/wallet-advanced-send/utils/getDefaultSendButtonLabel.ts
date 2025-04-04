import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { parseUnits } from 'viem';

export function getDefaultSendButtonLabel(
  cryptoAmount: string | null,
  selectedToken: PortfolioTokenWithFiatValue | null,
) {
  if (!cryptoAmount) {
    return 'Input amount';
  }

  if (!selectedToken) {
    return 'Select token';
  }

  if (
    parseUnits(cryptoAmount, selectedToken.decimals) >
    selectedToken.cryptoBalance
  ) {
    return 'Insufficient balance';
  }

  return 'Continue';
}
