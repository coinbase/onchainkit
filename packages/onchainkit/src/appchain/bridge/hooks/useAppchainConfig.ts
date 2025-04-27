'use client';
import { useReadContract } from 'wagmi';
import { DeployChainABI } from '../abi';
import { APPCHAIN_DEPLOY_CONTRACT_ADDRESS } from '../constants';
import type { AppchainConfig } from '../types';

export interface ChainConfigParams {
  l2ChainId: number;
  appchainChainId: number;
}

export function useChainConfig(params: ChainConfigParams) {
  const { data, isLoading, isError, error } = useReadContract({
    abi: DeployChainABI,
    functionName: 'deployAddresses',
    args: [BigInt(params.appchainChainId)],
    address:
      APPCHAIN_DEPLOY_CONTRACT_ADDRESS[
        params.l2ChainId as keyof typeof APPCHAIN_DEPLOY_CONTRACT_ADDRESS
      ],
    query: {
      staleTime: 1000 * 60 * 60, // 1 hour
      retry: 2,
      enabled: !!params.l2ChainId && !!params.appchainChainId,
      gcTime: 0,
    },
    // Read from the L2 contract
    chainId: params.l2ChainId,
  });

  return {
    config: error
      ? undefined
      : ({
          chainId: params.appchainChainId,
          contracts: data,
        } as AppchainConfig),
    isLoading,
    isError,
    error,
  };
}
