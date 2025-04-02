import type { GetSwapQuoteResponse } from '@/api/types';
import type { LifecycleStatusUpdate } from '@/internal/types';
import type { LifecycleStatus, SwapUnit } from '@/swap/types';
import { isSwapError } from '../../swap/utils/isSwapError';

type ValidateQuoteParams = {
  responseETH?: GetSwapQuoteResponse;
  responseUSDC?: GetSwapQuoteResponse;
  responseFrom?: GetSwapQuoteResponse;
  updateLifecycleStatus: (
    status: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void;
  to: SwapUnit;
};

export function validateQuote({
  to,
  responseETH,
  responseUSDC,
  responseFrom,
  updateLifecycleStatus,
}: ValidateQuoteParams) {
  if (!isSwapError(responseETH) && responseETH?.toAmountUSD) {
    to.setAmountUSD(responseETH?.toAmountUSD);
  } else if (!isSwapError(responseUSDC) && responseUSDC?.toAmountUSD) {
    to.setAmountUSD(responseUSDC.toAmountUSD);
  } else if (!isSwapError(responseFrom) && responseFrom?.toAmountUSD) {
    to.setAmountUSD(responseFrom.toAmountUSD);
  } else {
    updateLifecycleStatus({
      statusName: 'error',
      statusData: {
        code: 'TmBPc01',
        error: 'No valid quote found',
        message: '',
      },
    });
    return { isValid: false };
  }
  return { isValid: true };
}
