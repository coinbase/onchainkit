import type { LifeCycleStatus } from '../types';

export function updateMaxSlippage(
  status: LifeCycleStatus,
  maxSlippage: number,
): LifeCycleStatus {
  return {
    statusName: 'amountChange',
    statusData: {
      ...status.statusData,
      amountFrom: '',
      amountTo: '',
      isMissingRequiredField: true,
      maxSlippage,
    },
  };
}
