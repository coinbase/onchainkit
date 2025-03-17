import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { setOnchainKitConfig } from '../../core/OnchainKitConfig';
import { ONRAMP_API_BASE_URL } from '../constants';
import { fetchOnrampTransactionStatus } from './fetchOnrampTransactionStatus';

const mockApiKey = 'test-api-key';
const partnerUserId = 'test-user-id';
const nextPageKey = 'test-next-page-key';
const pageSize = '10';

const mockResponseData = {
  transactions: [],
  next_page_key: 'next-page-key',
  total_count: '100',
};

describe('fetchOnrampTransactionStatus', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponseData),
      }),
    ) as Mock;

    setOnchainKitConfig({ apiKey: mockApiKey });
  });

  it('should fetch transaction status and convert response to camel case', async () => {
    const result = await fetchOnrampTransactionStatus({
      partnerUserId,
      nextPageKey,
      pageSize,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${ONRAMP_API_BASE_URL}/buy/user/${partnerUserId}/transactions?page_key=${nextPageKey}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    expect(result).toEqual({
      transactions: [],
      nextPageKey: 'next-page-key',
      totalCount: '100',
    });
  });

  it('should use provided apiKey when available', async () => {
    const customApiKey = 'custom-api-key';
    await fetchOnrampTransactionStatus({
      partnerUserId,
      nextPageKey,
      pageSize,
      apiKey: customApiKey,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${ONRAMP_API_BASE_URL}/buy/user/${partnerUserId}/transactions?page_key=${nextPageKey}&page_size=${pageSize}`,
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${customApiKey}`,
        },
      }),
    );
  });

  it('should throw an error if fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Fetch failed')));

    await expect(
      fetchOnrampTransactionStatus({
        partnerUserId,
        nextPageKey,
        pageSize,
      }),
    ).rejects.toThrow('Fetch failed');
  });
});
