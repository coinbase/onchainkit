import { convertSnakeToCamelCase } from '../../internal/utils/convertSnakeToCamelCase';
import { getApiKey } from '../../internal/utils/getApiKey';
import { ONRAMP_API_BASE_URL } from '../constants';
import type { OnrampTransaction } from '../types';

type OnrampTransactionStatusResponseData = {
  /** List of `OnrampTransactions` in reverse chronological order. */
  transactions: OnrampTransaction[];
  /** A reference to the next page of transactions. */
  nextPageKey: string;
  /** The total number of transactions made by the user. */
  totalCount: string;
};

export async function fetchOnrampTransactionStatus({
  partnerUserId,
  nextPageKey,
  pageSize,
  apiKey,
}: {
  partnerUserId: string;
  nextPageKey: string;
  pageSize: string;
  apiKey?: string;
}): Promise<OnrampTransactionStatusResponseData> {
  const cpdApiKey = apiKey || getApiKey();

  const response = await fetch(
    `${ONRAMP_API_BASE_URL}/buy/user/${partnerUserId}/transactions?page_key=${nextPageKey}&page_size=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cpdApiKey}`,
      },
    },
  );

  const responseJson = await response.json();

  return convertSnakeToCamelCase<OnrampTransactionStatusResponseData>(
    responseJson,
  );
}
