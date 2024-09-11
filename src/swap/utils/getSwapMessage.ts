import type { GetSwapMessageParams } from '../types';
import { getErrorMessage } from './getErrorMessage';

export enum SwapMessage {
  BALANCE_ERROR = 'Error fetching token balance',
  CONFIRM_IN_WALLET = 'Confirm in wallet',
  FETCHING_QUOTE = 'Fetching quote...',
  FETCHING_BALANCE = 'Fetching balance...',
  INCOMPLETE_FIELD = 'Complete the fields to continue',
  INSUFFICIENT_BALANCE = 'Insufficient balance',
  LOW_LIQUIDITY = 'Liquidity too low for the token',
  SWAP_IN_PROGRESS = 'Swap in progress...',
  TOO_MANY_REQUESTS = 'Too many requests. Please try again later.',
  USER_REJECTED = 'User rejected the transaction',
}

export function getSwapMessage({
  address,
  from,
  lifeCycleStatus,
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
  if (lifeCycleStatus.statusName === 'transactionPending') {
    return SwapMessage.CONFIRM_IN_WALLET;
  }
  // handle loading states
  if (lifeCycleStatus.statusName === 'transactionApproved') {
    return SwapMessage.SWAP_IN_PROGRESS;
  }
  if (to.loading || from.loading) {
    return SwapMessage.FETCHING_QUOTE;
  }
  // missing required fields
  if (lifeCycleStatus.sharedData.isMissingRequiredField) {
    return SwapMessage.INCOMPLETE_FIELD;
  }

  // handle specific error codes
  if (lifeCycleStatus.statusName === 'error') {
    return getErrorMessage(lifeCycleStatus.statusData);
  }

  return '';
}
