export type TransactionHistoryItem = {
  hash: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: number;
  from: string;
  to: string;
  value: string;
  functionName?: string;
  args?: unknown[];
  gasUsed?: string;
  gasPrice?: string;
};

export type TransactionHistoryParams = {
  address?: string;
  chainId?: number;
  limit?: number;
  startBlock?: number;
  endBlock?: number;
  sort?: 'asc' | 'desc';
};

export type TransactionHistoryResponse = {
  transactions: TransactionHistoryItem[];
  hasMore: boolean;
};
