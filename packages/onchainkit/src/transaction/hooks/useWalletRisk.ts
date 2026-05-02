import { useCallback, useEffect, useState } from 'react';
import { useOnchainKit } from '@/useOnchainKit';
import { getWalletRisk } from '../utils/getWalletRisk';
import type { WalletRisk } from '../utils/getWalletRisk';
import type { APIError } from '@/api/types';
import type { Address } from 'viem';

export type UseWalletRiskParams = {
  address?: Address;
};

export function useWalletRisk({
  address,
}: UseWalletRiskParams = {}) {
  const { apiKey } = useOnchainKit();
  
  const [data, setData] = useState<WalletRisk | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const analyze = useCallback(async () => {
    if (!address) {
      setData(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await getWalletRisk(address, apiKey || undefined);

    if ('code' in result) {
      setError(result as APIError);
      setData(null);
    } else {
      setData(result);
    }

    setIsLoading(false);
  }, [address, apiKey]);

  useEffect(() => {
    analyze();
  }, [analyze]);

  return {
    risk: data?.risk ?? 'low',
    flags: data?.flags ?? [],
    isContract: data?.isContract ?? false,
    txCount: data?.txCount ?? 0,
    firstTxDate: data?.firstTxDate ?? null,
    lastTxDate: data?.lastTxDate ?? null,
    isLoading,
    error,
    refresh: analyze,
  };
}
