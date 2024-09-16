import { useCallback } from 'react';
import type { WalletCallReceipt } from 'viem';
import type { Config } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import type { LifecycleStatus } from '../types';

export function useAwaitCalls({
  accountConfig,
  config,
  data,
  setLifecycleStatus,
}: {
  accountConfig: Config;
  config: {
    maxSlippage: number;
  };
  data: {
    status: 'PENDING' | 'CONFIRMED';
    receipts?: WalletCallReceipt<bigint, 'success' | 'reverted'>[] | undefined;
  };
  setLifecycleStatus: React.Dispatch<React.SetStateAction<LifecycleStatus>>;
}) {
  return useCallback(async () => {
    if (data?.status === 'CONFIRMED' && data?.receipts) {
      const transactionReceipt = await waitForTransactionReceipt(
        accountConfig,
        {
          confirmations: 1,
          hash: data.receipts[data.receipts.length - 1].transactionHash,
        },
      );
      setLifecycleStatus({
        statusName: 'success',
        statusData: {
          isMissingRequiredField: false,
          maxSlippage: config.maxSlippage,
          transactionReceipt,
        },
      });
    }
  }, [accountConfig, config.maxSlippage, data, setLifecycleStatus]);
}
