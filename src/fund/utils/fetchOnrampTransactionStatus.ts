import { convertSnakeToCamelCase } from '../../internal/utils/convertSnakeToCamelCase';
import { ONRAMP_API_BASE_URL } from '../constants';
import type { OnrampTransaction } from '../types';

type OnrampTransactionStatusResponseData = {
  /**
   * List of `OnrampTransactions` in reverse chronological order.
   */
  transactions: OnrampTransaction[];
  /**
   * A reference to the next page of transactions.
   */
  nextPageKey: string;
  /**
   * The total number of transactions made by the user.
   */
  totalCount: string;
};

export async function fetchOnrampTransactionStatus({
  apiKey,
  partnerUserId,
  nextPageKey,
  pageSize,
}: {
  apiKey: string;
  partnerUserId: string;
  nextPageKey: string;
  pageSize: string;
}): Promise<OnrampTransactionStatusResponseData> {
  const response = await fetch(
    `${ONRAMP_API_BASE_URL}/buy/user/${partnerUserId}/transactions?page_key=${nextPageKey}&page_size=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  const responseJson = await response.json();

  return convertSnakeToCamelCase<OnrampTransactionStatusResponseData>(
    responseJson.data,
  );
}
