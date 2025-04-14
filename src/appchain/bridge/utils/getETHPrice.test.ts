import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getETHPrice } from './getETHPrice';

describe('getETHPrice', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks();
  });

  it('should return ETH price when API call is successful', async () => {
    const mockResponse = {
      data: {
        amount: '1850.50',
        base: 'ETH',
        currency: 'USD',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const price = await getETHPrice();

    expect(price).toBe('1850.50');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.coinbase.com/v2/prices/ETH-USD/spot',
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should return "0" when API call fails with non-200 status', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const price = await getETHPrice();

    expect(price).toBe('0');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching ETH price:',
      expect.any(Error),
    );
  });

  it('should return "0" when API call throws an error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const price = await getETHPrice();

    expect(price).toBe('0');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching ETH price:',
      expect.any(Error),
    );
  });

  it('should return "0" when response JSON is invalid', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    const price = await getETHPrice();

    expect(price).toBe('0');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching ETH price:',
      expect.any(Error),
    );
  });
});
