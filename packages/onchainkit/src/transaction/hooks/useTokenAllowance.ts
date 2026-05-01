import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';
import { getTokenAllowance } from '../utils/getTokenAllowance';
import type { TokenAllowance } from '../utils/getTokenAllowance';
import type { APIError } from '@/api/types';
import type { Address } from 'viem';

export type UseTokenAllowanceParams = {
  owner?: Address;
  tokens?: Address[];      // specific tokens to check
  spenders?: Address[];    // specific spenders to check
};

export function useTokenAllowance({
  owner: propOwner,
  tokens,
  spenders,
}: UseTokenAllowanceParams = {}) {
  const { address: connectedAddress } = useAccount();
  const { chain } = useOnchainKit();
  
  const owner = propOwner || connectedAddress;
  
  const [allowances, setAllowances] = useState<TokenAllowance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const fetchAllowances = useCallback(async () => {
    if (!owner || !tokens || tokens.length === 0) {
      setAllowances([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const results: TokenAllowance[] = [];
    const errors: APIError[] = [];

    // If no spenders specified, we can't query all (would need indexer)
    // For now, require spenders or return empty
    if (!spenders || spenders.length === 0) {
      setAllowances([]);
      setIsLoading(false);
      return;
    }

    for (const token of tokens) {
      for (const spender of spenders!) {
        const result = await getTokenAllowance({
          owner,
          token,
          spender,
          chainId: chain.id,
        });

        if ('code' in result) {
          errors.push(result as APIError);
        } else {
          results.push(result);
        }
      }
    }

    setAllowances(results);
    if (errors.length > 0) {
      setError(errors[0]); // Return first error
    }
    setIsLoading(false);
  }, [owner, tokens, spenders, chain.id]);

  useEffect(() => {
    fetchAllowances();
  }, [fetchAllowances]);

  return {
    allowances,
    isLoading,
    error,
    refetch: fetchAllowances,
  };
}
