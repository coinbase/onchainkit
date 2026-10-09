import { useCallback, useEffect, useState } from 'react';
import { useConfig } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';
import { useTransactionContext } from '../components/TransactionProvider';
import { estimateGasFee } from '../utils/estimateGas';
import type { GasEstimate } from '../utils/estimateGas';
import type { APIError } from '@/api/types';

export type UseGasEstimatorParams = {
  maxAcceptableFee?: string; // in ETH, e.g. "0.01"
  refreshInterval?: number;   // ms, default 15000
};

export function useGasEstimator({
  maxAcceptableFee,
  refreshInterval = 15000,
}: UseGasEstimatorParams = {}) {
  const config = useConfig();
  const { chain } = useOnchainKit();
  const { calls } = useTransactionContext();
  
  const [data, setData] = useState<GasEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const estimate = useCallback(async () => {
    if (!calls || calls.length === 0) {
      setData(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await estimateGasFee(
      config,
      chain.id,
      calls.map(c => ({ to: c.to, data: c.data, value: c.value })),
      maxAcceptableFee,
    );

    if ('code' in result) {
      setError(result as APIError);
      setData(null);
    } else {
      setData(result);
    }

    setIsLoading(false);
  }, [config, chain.id, calls, maxAcceptableFee]);

  // Auto-refresh
  useEffect(() => {
    estimate();
    const interval = setInterval(estimate, refreshInterval);
    return () => clearInterval(interval);
  }, [estimate, refreshInterval]);

  return {
    estimatedFee: data?.estimatedFee ?? null,
    maxFee: data?.maxFee ?? null,
    gasUnits: data?.gasUnits ?? null,
    gasPrice: data?.gasPrice ?? null,
    isSpike: data?.isSpike ?? false,
    isSafe: data?.isSafe ?? false,
    waitTimeMinutes: data?.waitTimeMinutes ?? null,
    isLoading,
    error,
    refresh: estimate,
  };
}
