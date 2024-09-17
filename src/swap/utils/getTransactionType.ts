import type { Call } from '../../transaction/types';

export function getTransactionType(
  transactions: Call[],
  index: number,
): 'ERC20' | 'Permit2' | 'Swap' | null {
  // Permit2 has 3 transactions, 2nd to last is the `Permit2` approval
  if (transactions.length === 3 && index === 0) {
    return 'Permit2';
  }
  // 2nd to last transaction is the `ERC20` approval
  if (index === transactions.length - 2) {
    return 'ERC20';
  }
  // Last transaction is the swap itself
  if (index === transactions.length - 1) {
    return 'Swap';
  }
  // This should never happen
  return null;
}
