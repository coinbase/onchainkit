import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFundContext } from '../components/FundCardProvider';
import { useExchangeRate } from './useExchangeRate';

const mockResponseData = {
  payment_total: { value: '100.00', currency: 'USD' },
  payment_subtotal: { value: '120.00', currency: 'USD' },
  purchase_amount: { value: '0.1', currency: 'BTC' },
  coinbase_fee: { value: '2.00', currency: 'USD' },
  network_fee: { value: '1.00', currency: 'USD' },
  quote_id: 'quote-id-123',
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockResponseData),
  }),
) as Mock;

vi.mock('../../core-react/internal/hooks/useDebounce', () => ({
  useDebounce: vi.fn((callback) => callback),
}));

vi.mock('../components/FundCardProvider', () => ({
  useFundContext: vi.fn(),
}));

let mockSetExchangeRate = vi.fn();
let mockSetExchangeRateLoading = vi.fn();

describe('useExchangeRate', () => {
  beforeEach(() => {
    setOnchainKitConfig({ apiKey: '123456789' });
    mockSetExchangeRate = vi.fn();
    mockSetExchangeRateLoading = vi.fn();
    (useFundContext as Mock).mockReturnValue({
      exchangeRateLoading: false,
      setExchangeRate: mockSetExchangeRate,
      setExchangeRateLoading: mockSetExchangeRateLoading,
    });
  });

  it('should fetch and set exchange rate correctly', async () => {
    // Mock dependencies

    renderHook(() => useExchangeRate('BTC'));

    // Assert loading state
    expect(mockSetExchangeRateLoading).toHaveBeenCalledWith(true);

    // Wait for the exchange rate to be fetched
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert loading state is false and exchange rate is set correctly
    expect(mockSetExchangeRateLoading).toHaveBeenCalledWith(false);
    expect(mockSetExchangeRate).toHaveBeenCalledWith(0.0008333333333333334);
  });

  it('should not fetch exchange rate if already loading', () => {
    // Mock exchangeRateLoading as true
    (useFundContext as Mock).mockReturnValue({
      exchangeRateLoading: true,
      setExchangeRate: mockSetExchangeRate,
      setExchangeRateLoading: mockSetExchangeRateLoading,
    });

    // Render the hook
    renderHook(() => useExchangeRate('BTC'));

    // Assert that setExchangeRateLoading was not called
    expect(mockSetExchangeRateLoading).not.toHaveBeenCalled();

    // Assert that setExchangeRate was not called
    expect(mockSetExchangeRate).not.toHaveBeenCalled();
  });
});
