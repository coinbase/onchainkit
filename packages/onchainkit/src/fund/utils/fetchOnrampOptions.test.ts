import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { setOnchainKitConfig } from '../../core/OnchainKitConfig';
import { ONRAMP_API_BASE_URL } from '../constants';
import { fetchOnrampOptions } from './fetchOnrampOptions';

const mockApiKey = 'test-api-key';
const country = 'US';
const subdivision = 'NY';
const mockResponseData = {
  payment_currencies: [],
  purchase_currencies: [],
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockResponseData),
  }),
) as Mock;

describe('fetchOnrampOptions', () => {
  beforeEach(() => {
    setOnchainKitConfig({ apiKey: mockApiKey });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch onramp options successfully', async () => {
    const result = await fetchOnrampOptions({ country, subdivision });

    expect(global.fetch).toHaveBeenCalledWith(
      `${ONRAMP_API_BASE_URL}/buy/options?country=${country}&subdivision=${subdivision}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${mockApiKey}`,
        },
      },
    );

    expect(result).toEqual({
      paymentCurrencies: [],
      purchaseCurrencies: [],
    });
  });

  it('should use provided apiKey when available', async () => {
    const customApiKey = 'custom-api-key';
    await fetchOnrampOptions({ country, subdivision, apiKey: customApiKey });

    expect(global.fetch).toHaveBeenCalledWith(
      `${ONRAMP_API_BASE_URL}/buy/options?country=${country}&subdivision=${subdivision}`,
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${customApiKey}`,
        },
      }),
    );
  });

  it('should handle fetch errors', async () => {
    (global.fetch as Mock).mockRejectedValue(new Error('Fetch error'));

    await expect(fetchOnrampOptions({ country, subdivision })).rejects.toThrow(
      'Fetch error',
    );
  });
});
