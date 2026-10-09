import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';
import { getTransactionHistory } from '../utils/getTransactionHistory';
import type {
  TransactionHistoryItem,
  TransactionHistoryParams,
} from '../types/history';
import type { APIError } from '@/api/types';

export type UseTransactionHistoryParams = {
  address?: string;
  limit?: number;
  startBlock?: number;
  endBlock?: number;
  sort?: 'asc' | 'desc';
};

export function useTransactionHistory({
  address: propAddress,
  limit = 20,
  startBlock,
  endBlock,
  sort = 'desc',
}: UseTransactionHistoryParams = {}) {
  const { address: connectedAddress } = useAccount();
  const { apiKey } = useOnchainKit();
  
  const address = propAddress || connectedAddress;
  
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!address) {
      setTransactions([]);
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const params: TransactionHistoryParams = {
      address,
      limit,
      startBlock,
      endBlock,
      sort,
    };

    const result = await getTransactionHistory(params, apiKey || undefined);

    if ('code' in result) {
      setError(result as APIError);
      setTransactions([]);
      setHasMore(false);
    } else {
      setTransactions(result.transactions);
      setHasMore(result.hasMore);
    }

    setIsLoading(false);
  }, [address, limit, startBlock, endBlock, sort, apiKey]);

  const loadMore = useCallback(async () => {
    // TODO: Implement pagination with offset
    // For now, just refetch
    await fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    transactions,
    isLoading,
    hasMore,
    loadMore,
    error,
    refetch: fetchHistory,
  };
}
