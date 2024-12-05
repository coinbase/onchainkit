import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { ONRAMP_API_BASE_URL } from '../constants';
import { fetchOnrampTransactionStatus } from './fetchOnrampTransactionStatus';

const apiKey = 'test-api-key';
const partnerUserId = 'test-user-id';
const nextPageKey = 'test-next-page-key';
const pageSize = '10';

const mockResponseData = {
  data: {
    transactions: [],
    next_page_key: 'next-page-key',
    total_count: '100',
  },
};

describe('fetchOnrampTransactionStatus', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponseData),
      }),
    ) as Mock;
  });

  it('should fetch transaction status and convert response to camel case', async () => {
    const result = await fetchOnrampTransactionStatus({
      apiKey,
      partnerUserId,
      nextPageKey,
      pageSize,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${ONRAMP_API_BASE_URL}/buy/user/${partnerUserId}/transactions?page_key=${nextPageKey}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    expect(result).toEqual({
      transactions: [],
      nextPageKey: 'next-page-key',
      totalCount: '100',
    });
  });

  it('should throw an error if fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Fetch failed')));

    await expect(
      fetchOnrampTransactionStatus({
        apiKey,
        partnerUserId,
        nextPageKey,
        pageSize,
      }),
    ).rejects.toThrow('Fetch failed');
  });
});
