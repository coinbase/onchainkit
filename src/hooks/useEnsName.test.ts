/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react';
import { publicClient } from '../store/client';
import { inMemoryStorageService } from '../store/storageServices';
import { useEnsName, ensNameAction } from './useEnsName';
import { useOnchainActionWithCache } from './useOnchainActionWithCache';

jest.mock('../store/client');
jest.mock('../store/storageServices');
jest.mock('./useOnchainActionWithCache');

describe('useEnsName Hook', () => {
  const mockUseOnchainActionWithCache = useOnchainActionWithCache as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and returns ENS name', () => {
    const walletAddress = '0x1234';
    const expectedEnsName = 'avatarUrl';
    mockUseOnchainActionWithCache.mockImplementation(() => {
      return expectedEnsName;
    });

    const { result } = renderHook(() => useEnsName(walletAddress));
    const name = result.current.ensName;

    expect(name).toEqual(expectedEnsName);
    expect(mockUseOnchainActionWithCache).toHaveBeenCalledWith(
      expect.any(Function),
      `ens-name-${walletAddress}`,
      inMemoryStorageService,
    );
  });
});

describe('ensNameAction Function', () => {
  const mockGetEnsName = publicClient.getEnsName as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches ENS name for valid wallet address', async () => {
    const walletAddress = '0x1234';
    const expectedEnsName = 'avatarUrl';

    mockGetEnsName.mockResolvedValue(expectedEnsName);

    const action = ensNameAction(walletAddress);
    const name = await action();

    expect(name).toBe(expectedEnsName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
  });
});
