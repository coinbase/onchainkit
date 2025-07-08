import { useCallback, useEffect, useState } from 'react';
import type { Address } from 'viem';
import { parseUnits } from 'viem';
import type { APIError } from '@/api/types';
import type { FetchPermissionsResultItem } from '../types';
import type { Token } from '@/token';
import {
  fetchPermissions,
  hasMatchingPermission,
} from '../utils/fetchPermissions';
import { calculateDurationInSeconds } from '../utils/calculateDuration';
import type { Duration } from '../types';

export type UseSubscriptionPermissionsProps = {
  account?: Address;
  chainId?: number;
  spender: Address;
  token: Token;
  amount: string;
  interval: Duration;
};

export type UseSubscriptionPermissionsResult = {
  existingPermission: FetchPermissionsResultItem | null;
  isLoading: boolean;
  error: APIError | null;
  refetch: () => void;
};

export function useSubscriptionPermissions({
  account,
  chainId,
  spender,
  token,
  amount,
  interval,
}: UseSubscriptionPermissionsProps): UseSubscriptionPermissionsResult {
  const [existingPermission, setExistingPermission] =
    useState<FetchPermissionsResultItem | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as loading until we have data
  const [error, setError] = useState<APIError | null>(null);

  const checkPermissions = useCallback(async () => {
    // If we don't have the required data, don't check yet but stop loading
    if (!account || !chainId || !token.address) {
      setExistingPermission(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const permissions = await fetchPermissions({
        chainId: `0x${chainId.toString(16)}`,
        account,
        spender,
      });

      const periodInSeconds = calculateDurationInSeconds(interval);
      // Use parseUnits to handle decimal amounts and avoid precision loss for high decimals
      const allowanceAmount = parseUnits(amount, token.decimals);

      const matchingPermission = hasMatchingPermission(
        permissions.permissions,
        token.address as `0x${string}`,
        periodInSeconds,
        allowanceAmount,
      );

      setExistingPermission(matchingPermission);
    } catch (err) {
      const errorData: APIError = {
        code: 'SuPr01', // Subscribe Provider 01 error
        error: JSON.stringify(err),
        message:
          err instanceof Error ? err.message : 'Failed to fetch permissions',
      };
      setError(errorData);
      setExistingPermission(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    account,
    chainId,
    spender,
    token.address,
    token.decimals,
    amount,
    interval,
  ]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    existingPermission,
    isLoading,
    error,
    refetch: checkPermissions,
  };
}
