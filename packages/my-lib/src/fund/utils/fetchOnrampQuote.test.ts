import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { setOnchainKitConfig } from '../../core/OnchainKitConfig';
import { ONRAMP_API_BASE_URL } from '../constants';
import { fetchOnrampQuote } from './fetchOnrampQuote';

const mockApiKey = 'test-api-key';
const mockPurchaseCurrency = 'BTC';
const mockPurchaseNetwork = 'bitcoin';
const mockPaymentCurrency = 'USD';
const mockPaymentMethod = 'credit_card';
const mockPaymentAmount = '100.00';
const mockCountry = 'US';
const mockSubdivision = 'NY';

const mockResponseData = {
  payment_total: { amount: '105.00', currency: 'USD' },
  payment_subtotal: { amount: '100.00', currency: 'USD' },
  purchase_amount: { amount: '0.0025', currency: 'BTC' },
  coinbase_fee: { amount: '3.00', currency: 'USD' },
  network_fee: { amount: '2.00', currency: 'USD' },
  quote_id: 'quote-id-123',
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockResponseData),
  }),
) as Mock;

describe('fetchOnrampQuote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setOnchainKitConfig({ apiKey: mockApiKey });
  });

  it('should fetch onramp quote successfully', async () => {
    const result = await fetchOnrampQuote({
      purchaseCurrency: mockPurchaseCurrency,
      purchaseNetwork: mockPurchaseNetwork,
      paymentCurrency: mockPaymentCurrency,
      paymentMethod: mockPaymentMethod,
      paymentAmount: mockPaymentAmount,
      country: mockCountry,
      subdivision: mockSubdivision,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${ONRAMP_API_BASE_URL}/buy/quote`,
      {
        method: 'POST',
        body: JSON.stringify({
          purchase_currency: mockPurchaseCurrency,
          purchase_network: mockPurchaseNetwork,
          payment_currency: mockPaymentCurrency,
          payment_method: mockPaymentMethod,
          payment_amount: mockPaymentAmount,
          country: mockCountry,
          subdivision: mockSubdivision,
        }),
        headers: {
          Authorization: `Bearer ${mockApiKey}`,
        },
      },
    );
    expect(result).toEqual({
      paymentSubtotal: { amount: '100.00', currency: 'USD' },
      paymentTotal: { amount: '105.00', currency: 'USD' },
      purchaseAmount: { amount: '0.0025', currency: 'BTC' },
      coinbaseFee: { amount: '3.00', currency: 'USD' },
      networkFee: { amount: '2.00', currency: 'USD' },
      quoteId: 'quote-id-123',
    });
  });

  it('should use provided apiKey when available', async () => {
    const customApiKey = 'custom-api-key';
    await fetchOnrampQuote({
      purchaseCurrency: mockPurchaseCurrency,
      purchaseNetwork: mockPurchaseNetwork,
      paymentCurrency: mockPaymentCurrency,
      paymentMethod: mockPaymentMethod,
      paymentAmount: mockPaymentAmount,
      country: mockCountry,
      subdivision: mockSubdivision,
      apiKey: customApiKey,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${ONRAMP_API_BASE_URL}/buy/quote`,
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${customApiKey}`,
        },
      }),
    );
  });

  it('should throw an error if fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Fetch failed')),
    ) as Mock;

    await expect(
      fetchOnrampQuote({
        purchaseCurrency: mockPurchaseCurrency,
        purchaseNetwork: mockPurchaseNetwork,
        paymentCurrency: mockPaymentCurrency,
        paymentMethod: mockPaymentMethod,
        paymentAmount: mockPaymentAmount,
        country: mockCountry,
        subdivision: mockSubdivision,
      }),
    ).rejects.toThrow('Fetch failed');
  });
});
