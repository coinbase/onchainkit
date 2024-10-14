import { renderHook, waitFor } from '@testing-library/react';
import { useMintToken } from './useMintToken';
import { getMintToken } from '../utils/getMintToken';
import { type Mock, vi, describe, beforeEach, it, expect } from 'vitest';
import { getNewReactQueryTestProvider } from '../../identity/hooks/getNewReactQueryTestProvider';

vi.mock('../utils/getMintToken');

describe('useMintToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch mint token data successfully', async () => {
    const mockData = { data: 'mockData' };
    (getMintToken as Mock).mockResolvedValue(mockData);

    const { result } = renderHook(
      () =>
        useMintToken({
          mintAddress: '0x123',
          takerAddress: '0x456',
          network: 'mainnet',
          quantity: '1',
          tokenId: 'token123',
        }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });
  });

  it('should not fetch data if enabled is false', async () => {
    renderHook(
      () =>
        useMintToken(
          {
            mintAddress: '0x123',
            takerAddress: '0x456',
            network: 'mainnet',
            quantity: '1',
            tokenId: 'token123',
          },
          { enabled: false },
        ),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => {
      expect(getMintToken).not.toHaveBeenCalled();
    });
  });

  it('should handle error state', async () => {
    const mockError = new Error('Failed to fetch');
    (getMintToken as Mock).mockRejectedValue(mockError);

    const { result } = renderHook(
      () =>
        useMintToken({
          mintAddress: '0x123',
          takerAddress: '0x456',
          network: 'mainnet',
          quantity: '1',
          tokenId: 'token123',
        }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });
  });
});
