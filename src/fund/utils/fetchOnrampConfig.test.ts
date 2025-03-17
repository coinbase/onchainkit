import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { setOnchainKitConfig } from '../../core/OnchainKitConfig';
import { ONRAMP_API_BASE_URL } from '../constants';
import { fetchOnrampConfig } from './fetchOnrampConfig';

const mockApiKey = 'test-api-key';
const mockResponseData = {
  countries: [
    {
      id: 'US',
      subdivisions: ['CA', 'NY'],
      payment_methods: ['credit_card', 'bank_transfer'],
    },
  ],
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockResponseData),
  }),
) as Mock;

describe('fetchOnrampConfig', () => {
  beforeEach(() => {
    setOnchainKitConfig({ apiKey: mockApiKey });
  });

  it('should fetch onramp config and return data', async () => {
    const data = await fetchOnrampConfig();

    expect(fetch).toHaveBeenCalledWith(`${ONRAMP_API_BASE_URL}/buy/config`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${mockApiKey}`,
      },
    });

    expect(data).toEqual({
      countries: [
        {
          id: 'US',
          subdivisions: ['CA', 'NY'],
          paymentMethods: ['credit_card', 'bank_transfer'],
        },
      ],
    });
  });

  it('should use provided apiKey when available', async () => {
    const customApiKey = 'custom-api-key';
    await fetchOnrampConfig(customApiKey);

    expect(fetch).toHaveBeenCalledWith(
      `${ONRAMP_API_BASE_URL}/buy/config`,
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${customApiKey}`,
        },
      }),
    );
  });

  it('should throw an error if the fetch fails', async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Fetch failed')),
    );

    await expect(fetchOnrampConfig()).rejects.toThrow('Fetch failed');
  });
});
