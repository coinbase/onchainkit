import { useCallback, useEffect, useState } from 'react';
import { useOnchainKit } from '@/useOnchainKit';
import { getContractVerification } from '../utils/getContractVerification';
import type { ContractVerificationData } from '../utils/getContractVerification';
import type { APIError } from '@/api/types';

export type UseContractVerificationParams = {
  address?: string;
};

export function useContractVerification({
  address,
}: UseContractVerificationParams = {}) {
  const { apiKey } = useOnchainKit();
  
  const [data, setData] = useState<ContractVerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const verify = useCallback(async () => {
    if (!address) {
      setData(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await getContractVerification(address, apiKey || undefined);

    if ('code' in result) {
      setError(result as APIError);
      setData(null);
    } else {
      setData(result);
    }

    setIsLoading(false);
  }, [address, apiKey]);

  useEffect(() => {
    verify();
  }, [verify]);

  return {
    isVerified: data?.isVerified ?? false,
    isProxy: data?.isProxy ?? false,
    proxyTarget: data?.proxyTarget ?? null,
    contractName: data?.contractName ?? null,
    sourceCode: data?.sourceCode ?? null,
    compilerVersion: data?.compilerVersion ?? null,
    deployedAt: data?.deployedAt ?? null,
    deployer: data?.deployer ?? null,
    risk: data?.risk ?? 'high',
    warnings: data?.warnings ?? [],
    isLoading,
    error,
    refetch: verify,
  };
}
