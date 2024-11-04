import { SwapMessage } from '../constants.js';
import { getErrorMessage } from './getErrorMessage.js';
function getSwapMessage({
  address,
  from,
  lifecycleStatus,
  to
}) {
  // handle specific error codes
  if (lifecycleStatus.statusName === 'error') {
    return getErrorMessage(lifecycleStatus.statusData);
  }

  // handle balance error
  if (from.error || to.error) {
    return SwapMessage.BALANCE_ERROR;
  }
  // handle amount exceeds balance (if connected)
  if (address && Number(from.balance) < Number(from.amount)) {
    return SwapMessage.INSUFFICIENT_BALANCE;
  }
  // handle pending transaction
  if (lifecycleStatus.statusName === 'transactionPending') {
    return SwapMessage.CONFIRM_IN_WALLET;
  }
  // handle loading states
  if (lifecycleStatus.statusName === 'transactionApproved') {
    return SwapMessage.SWAP_IN_PROGRESS;
  }
  if (to.loading || from.loading) {
    return SwapMessage.FETCHING_QUOTE;
  }
  // missing required fields
  if (lifecycleStatus.statusData.isMissingRequiredField) {
    return SwapMessage.INCOMPLETE_FIELD;
  }
  return '';
}
export { getSwapMessage };
//# sourceMappingURL=getSwapMessage.js.map
