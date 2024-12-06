import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { ONRAMP_API_BASE_URL } from '../constants';
import { fetchOnrampOptions } from './AAfetchOnrampOptions';

const apiKey = 'test-api-key';
const country = 'US';
const subdivision = 'NY';
const mockResponseData = {
  data: {
    payment_currencies: [],
    purchase_currencies: [],
  },
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockResponseData),
  }),
) as Mock;

describe('fetchOnrampOptions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch onramp options successfully', async () => {
    const result = await fetchOnrampOptions({ apiKey, country, subdivision });

    expect(global.fetch).toHaveBeenCalledWith(
      `${ONRAMP_API_BASE_URL}/buy/options?country=${country}&subdivision=${subdivision}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    expect(result).toEqual({
      paymentCurrencies: [],
      purchaseCurrencies: [],
    });
  });

  it('should handle fetch errors', async () => {
    (global.fetch as Mock).mockRejectedValue(new Error('Fetch error'));

    await expect(
      fetchOnrampOptions({ apiKey, country, subdivision }),
    ).rejects.toThrow('Fetch error');
  });
});
