import { LOW_LIQUIDITY_ERROR_CODE } from '../constants';
import type { GetSwapMessageParams } from '../types';

export enum SwapMessage {
  BALANCE_ERROR = 'Error fetching token balance',
  INCOMPLETE_FIELD = 'Complete the fields to continue',
  INSUFFICIENT_BALANCE = 'Insufficient balance',
  LOW_LIQUIDITY = 'Liquidity too low for the token',
  CONFIRM_IN_WALLET = 'Confirm in wallet',
  SWAP_IN_PROGRESS = 'Swap in progress...',
  FETCHING_QUOTE = 'Fetching quote...',
  FETCHING_BALANCE = 'Fetching balance...',
}

export function getSwapMessage({
  error,
  from,
  loading,
  pendingTransaction,
  to,
}: GetSwapMessageParams) {
  // handle balance error
  if (from.error || to.error) {
    return SwapMessage.BALANCE_ERROR;
  }
  // handle amount exceeds balance
  if (Number(from.balance) < Number(from.amount)) {
    return SwapMessage.INSUFFICIENT_BALANCE;
  }
  // handle pending transaction
  if (pendingTransaction) {
    return SwapMessage.CONFIRM_IN_WALLET;
  }
  // handle loading states
  if (loading) {
    return SwapMessage.SWAP_IN_PROGRESS;
  }
  if (to.loading || from.loading) {
    return SwapMessage.FETCHING_QUOTE;
  }
  // missing required fields
  if (!from.amount || !from.token || !to.amount || !to.token) {
    return SwapMessage.INCOMPLETE_FIELD;
  }
  // error states handled below
  if (!error) {
    return '';
  }
  // handle invalid params error
  if (
    Object.values(error)?.find(
      (error) => error?.code === LOW_LIQUIDITY_ERROR_CODE,
    )
  ) {
    return SwapMessage.LOW_LIQUIDITY;
  }
  // handle general error
  if (Object.values(error).length) {
    return Object.values(error)[0]?.error;
  }
}
