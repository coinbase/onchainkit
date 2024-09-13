import { SwapMessage } from '../constants';
import type { GetSwapMessageParams } from '../types';
import { getErrorMessage } from './getErrorMessage';

export function getSwapMessage({
  address,
  error,
  from,
  loading,
  isMissingRequiredFields,
  isTransactionPending,
  to,
}: GetSwapMessageParams) {
  // handle balance error
  if (from.error || to.error) {
    return SwapMessage.BALANCE_ERROR;
  }
  // handle amount exceeds balance (if connected)
  if (address && Number(from.balance) < Number(from.amount)) {
    return SwapMessage.INSUFFICIENT_BALANCE;
  }
  // handle pending transaction
  if (isTransactionPending) {
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
  if (isMissingRequiredFields) {
    return SwapMessage.INCOMPLETE_FIELD;
  }
  if (!error) {
    return '';
  }
  // handle specific error codes
  return getErrorMessage(error);
}
