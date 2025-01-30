import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { parseUnits } from 'viem';

// const parsedCryptoAmount = parseUnits(
//   cryptoAmount ?? '',
//   selectedToken?.decimals ?? 0,
// );
// const parsedCryptoBalance = parseUnits(
//   String(selectedToken?.cryptoBalance) ?? '',
//   selectedToken?.decimals ?? 0,
// );

// const sendButtonLabel = useMemo(() => {
//   if (parsedCryptoAmount > parsedCryptoBalance) {
//     return 'Insufficient balance';
//   }
//   return label;
// }, [parsedCryptoAmount, parsedCryptoBalance, label]);

// const isDisabled = useMemo(() => {
//   if (disabled) {
//     return true;
//   }
//   if (parsedCryptoAmount <= 0n || parsedCryptoAmount > parsedCryptoBalance) {
//     return true;
//   }
//   return false;
// }, [parsedCryptoAmount, parsedCryptoBalance, disabled]);

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
