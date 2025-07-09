// 🌲☀🌲
import type { APIError } from '@/api/types';
import { useCallback, useEffect, useState } from 'react';
import type {
  SubscriptionStatus,
  UseSubscriptionStatusParams,
  UseSubscriptionStatusResult,
  SpendPermission,
} from '../types';

// Mock implementation for now - in a real implementation this would:
// 1. Query the SpendPermissionManager contract to check if permission is approved
// 2. Check spending history to see current period usage
// 3. Calculate time-based information
async function fetchSubscriptionStatus(
  spendPermission: SpendPermission,
): Promise<SubscriptionStatus> {
  // This is a placeholder implementation
  // In reality, you would:
  // - Call SpendPermissionManager.isApproved()
  // - Query spending events from the contract
  // - Calculate current period information

  return {
    isActive: true,
    isRevoked: false,
    currentPeriod: {
      start: Math.floor(Date.now() / 1000),
      end: Math.floor(Date.now() / 1000) + spendPermission.period,
      spend: 0n,
    },
    remainingAllowance: spendPermission.allowance,
    currentPeriodSpent: false,
    timeUntilReset: spendPermission.period,
    subscriptionEnd: spendPermission.end,
  };
}

/**
 * Hook for checking the status of a subscription
 * @param params - Hook parameters
 * @returns Subscription status information and utilities
 *
 * Note: exported as public Hook
 */
export function useSubscriptionStatus({
  spendPermission,
  refreshInterval = 30000, // 30 seconds default
}: UseSubscriptionStatusParams): UseSubscriptionStatusResult {
  const [status, setStatus] = useState<SubscriptionStatus | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | undefined>();

  const fetchStatus = useCallback(async () => {
    if (!spendPermission) {
      setStatus(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const subscriptionStatus = await fetchSubscriptionStatus(spendPermission);
      setStatus(subscriptionStatus);
    } catch (err) {
      const errorData: APIError = {
        code: 'SuPr02', // Subscribe Provider 02 error
        error: JSON.stringify(err),
        message:
          err instanceof Error
            ? err.message
            : 'Failed to fetch subscription status',
      };
      setError(errorData);
    } finally {
      setIsLoading(false);
    }
  }, [spendPermission]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Set up polling if refresh interval is provided
  useEffect(() => {
    if (!refreshInterval || !spendPermission) {
      return;
    }

    const intervalId = setInterval(fetchStatus, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchStatus, refreshInterval, spendPermission]);

  return {
    status,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}
