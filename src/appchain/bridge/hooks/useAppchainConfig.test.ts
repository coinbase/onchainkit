import { getNewReactQueryTestProvider } from '@/identity/hooks/getNewReactQueryTestProvider';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReadContract } from 'wagmi';
import { APPCHAIN_DEPLOY_CONTRACT_ADDRESS } from '../constants';
import { useChainConfig } from './useAppchainConfig';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    useReadContract: vi.fn(),
  };
});

const wrapper = getNewReactQueryTestProvider();

const mockContractData = {
  l2OutputOracle: '0xOutputOracle',
  systemConfig: '0xSystemConfig',
  optimismPortal: '0xOptimismPortal',
  l1CrossDomainMessenger: '0xCrossDomainMessenger',
  l1StandardBridge: '0xStandardBridge',
  l1ERC721Bridge: '0xERC721Bridge',
  optimismMintableERC20Factory: '0xERC20Factory',
};

describe('useChainConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useReadContract as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockContractData,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it('should return config with contract addresses when successful', () => {
    const { result } = renderHook(
      () => useChainConfig({ l2ChainId: 8453, appchainChainId: 1 }),
      { wrapper },
    );
    expect(result.current.config).toEqual({
      chainId: 1,
      contracts: mockContractData,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should call useReadContract with correct parameters', () => {
    renderHook(() => useChainConfig({ l2ChainId: 84532, appchainChainId: 1 }), {
      wrapper,
    });
    expect(useReadContract).toHaveBeenCalledWith({
      abi: expect.any(Array),
      functionName: 'deployAddresses',
      args: [BigInt(1)],
      address: APPCHAIN_DEPLOY_CONTRACT_ADDRESS[84532],
      query: {
        staleTime: 1000 * 60 * 60,
        retry: 2,
        enabled: true,
        gcTime: 0,
      },
      chainId: 84532,
    });
  });

  it('should disable query when chainIds are not provided', () => {
    renderHook(() => useChainConfig({ l2ChainId: 0, appchainChainId: 0 }), {
      wrapper,
    });
    expect(useReadContract).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          enabled: false,
        }),
      }),
    );
  });

  it('should return undefined config when error', () => {
    (useReadContract as ReturnType<typeof vi.fn>).mockReturnValue({
      error: new Error('test error'),
    });
    const { result } = renderHook(
      () => useChainConfig({ l2ChainId: 84532, appchainChainId: 1 }),
      { wrapper },
    );
    expect(result.current.config).toBeUndefined();
  });
});
