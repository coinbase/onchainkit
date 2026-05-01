import type { APIError } from '@/api/types';
import { buildErrorStruct } from '@/api/utils/buildErrorStruct';
import { ApiErrorCode } from '@/api/constants';
import type {
  TransactionHistoryItem,
  TransactionHistoryParams,
  TransactionHistoryResponse,
} from '../types/history';

const BASESCAN_API_URL = 'https://api.basescan.org/api';

type BaseScanApiResponse = {
  status: string;
  message: string;
  result: Array<{
    hash: string;
    timeStamp: string;
    from: string;
    to: string;
    value: string;
    gasUsed: string;
    gasPrice: string;
    txreceipt_status: string;
    functionName: string;
    input: string;
  }>;
};

export async function getTransactionHistory(
  params: TransactionHistoryParams,
  apiKey?: string,
): Promise<TransactionHistoryResponse | APIError> {
  const { address, limit = 20, startBlock, endBlock, sort = 'desc' } = params;

  if (!address) {
    return buildErrorStruct({
      code: ApiErrorCode.AMGTa01,
      error: 'Missing address',
      message: 'Address is required to fetch transaction history',
    });
  }

  try {
    const queryParams = new URLSearchParams({
      module: 'account',
      action: 'txlist',
      address,
      startblock: startBlock?.toString() || '0',
      endblock: endBlock?.toString() || '99999999',
      page: '1',
      offset: limit.toString(),
      sort,
      ...(apiKey && { apikey: apiKey }),
    });

    const response = await fetch(`${BASESCAN_API_URL}?${queryParams}`);
    const data: BaseScanApiResponse = await response.json();

    if (data.status !== '1') {
      return buildErrorStruct({
        code: ApiErrorCode.AMGTa01,
        error: data.message,
        message: 'Failed to fetch transaction history from Basescan',
      });
    }

    const transactions: TransactionHistoryItem[] = data.result.map((tx) => ({
      hash: tx.hash,
      status: tx.txreceipt_status === '1' ? 'success' : 'failed',
      timestamp: parseInt(tx.timeStamp, 10) * 1000,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      functionName: tx.functionName || undefined,
    }));

    return {
      transactions,
      hasMore: data.result.length === limit,
    };
  } catch (error) {
    return buildErrorStruct({
      code: ApiErrorCode.AMGTa02,
      error: JSON.stringify(error),
      message: 'Something went wrong while fetching transaction history',
    });
  }
}
