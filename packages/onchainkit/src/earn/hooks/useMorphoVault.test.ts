import { MORPHO_TOKEN_BASE_ADDRESS } from '@/earn/constants';
import { fetchMorphoApy } from '@/earn/utils/fetchMorphoApy';
import { getNewReactQueryTestProvider } from '@/identity/hooks/getNewReactQueryTestProvider';
import { renderHook } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  type UseReadContractReturnType,
  type UseReadContractsReturnType,
  useReadContract,
  useReadContracts,
} from 'wagmi';
import { useMorphoVault } from './useMorphoVault';

const DUMMY_ADDRESS = '0x9E95f497a7663B70404496dB6481c890C4825fe1' as const;

vi.mock('wagmi', () => ({
  useReadContract: vi.fn(),
  useReadContracts: vi.fn(),
}));

vi.mock('@/earn/utils/fetchMorphoApy');

describe('useMorphoVault', () => {
  const mockParams = {
    vaultAddress: DUMMY_ADDRESS,
    address: DUMMY_ADDRESS,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns undefined values when contract reads are pending', () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: undefined,
      status: 'pending',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>);
    vi.mocked(useReadContract).mockReturnValue({
      data: undefined,
    } as UseReadContractReturnType<unknown[], string, unknown[], unknown>);

    (fetchMorphoApy as Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useMorphoVault(mockParams), {
      wrapper: getNewReactQueryTestProvider(),
    });

    expect(result.current).toEqual({
      status: 'pending',
      error: null,
      asset: {
        address: undefined,
        symbol: undefined,
        decimals: undefined,
      },
      vaultDecimals: undefined,
      vaultName: undefined,
      balance: undefined,
      balanceStatus: undefined,
      totalApy: undefined,
      nativeApy: undefined,
      vaultFee: undefined,
      refetchBalance: undefined,
      liquidity: undefined,
      deposits: undefined,
      rewards: [
        {
          apy: 0,
          asset: MORPHO_TOKEN_BASE_ADDRESS,
          assetName: 'MORPHO',
        },
      ],
    });
  });

  it('returns formatted data when contract reads are successful', async () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: [
        { result: DUMMY_ADDRESS }, // asset
        { result: 'Morpho Vault' }, // name
        { result: 18 }, // decimals
      ],
      status: 'success',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>); // for brevity

    vi.mocked(useReadContract).mockReturnValue({
      data: 1000000000000000000n, // 1e18
    } as UseReadContractReturnType<unknown[], string, unknown[], unknown>); // for brevity

    (fetchMorphoApy as Mock).mockResolvedValue({
      asset: {
        decimals: 18,
        symbol: 'DUMMY',
        address: DUMMY_ADDRESS,
      },
      symbol: 'DUMMY',
      liquidity: {
        underlying: '100000',
      },
      state: {
        netApy: 0.05,
        netApyWithoutRewards: 0.03,
        rewards: [
          {
            asset: {
              address: '0x1234',
              name: 'RewardToken',
            },
            supplyApr: 0.02,
          },
        ],
      },
    });

    const { result } = renderHook(() => useMorphoVault(mockParams), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await vi.waitFor(() => {
      expect(result.current).toMatchObject({
        status: 'success',
        asset: {
          address: DUMMY_ADDRESS,
          symbol: 'DUMMY',
          decimals: 18,
        },
        vaultDecimals: 18,
        vaultName: 'Morpho Vault',
        balance: '1',
        totalApy: 0.05,
        nativeApy: 0.03,
        rewards: [
          {
            apy: 0,
            asset: MORPHO_TOKEN_BASE_ADDRESS,
            assetName: 'MORPHO',
          },
          {
            apy: 0.02,
            asset: '0x1234',
            assetName: 'RewardToken',
          },
        ],
      });
    });
  });

  it('handles missing balance data', () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: [
        { result: DUMMY_ADDRESS },
        { result: 'Morpho Vault' },
        { result: undefined }, // missing balance
        { result: 18 },
      ],
      status: 'success',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>); // for brevity
    vi.mocked(useReadContract).mockReturnValue({
      data: 18,
    } as UseReadContractReturnType<unknown[], string, unknown[], unknown>); // for brevity

    const { result } = renderHook(() => useMorphoVault(mockParams), {
      wrapper: getNewReactQueryTestProvider(),
    });

    expect(result.current.balance).toBeUndefined();
  });

  it('includes APY and rewards data when available', async () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: [
        { result: DUMMY_ADDRESS },
        { result: 'Morpho Vault' },
        { result: 18 },
      ],
      status: 'success',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>);

    vi.mocked(useReadContract).mockReturnValue({
      data: 1000000000000000000n,
    } as UseReadContractReturnType<unknown[], string, unknown[], unknown>);

    (fetchMorphoApy as Mock).mockResolvedValue({
      asset: {
        decimals: 18,
        symbol: 'DUMMY',
        address: DUMMY_ADDRESS,
      },
      symbol: 'DUMMY',
      liquidity: {
        underlying: '100000000000000000000000',
      },
      state: {
        netApy: 0.05,
        netApyWithoutRewards: 0.03,
        totalAssets: '100000000000000000000000',
        rewards: [
          {
            asset: {
              address: '0x1234',
              name: 'RewardToken',
            },
            supplyApr: 0.02,
          },
        ],
      },
    });

    const { result } = renderHook(() => useMorphoVault(mockParams), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await vi.waitFor(() => {
      expect(result.current).toMatchObject({
        status: 'success',
        asset: {
          address: DUMMY_ADDRESS,
          symbol: 'DUMMY',
          decimals: 18,
        },
        vaultDecimals: 18,
        vaultName: 'Morpho Vault',
        balance: '1',
        balanceStatus: undefined,
        refetchBalance: undefined,
        liquidity: '100000',
        deposits: '100000',
        totalApy: 0.05,
        nativeApy: 0.03,
        vaultFee: undefined,
        rewards: [
          {
            asset: MORPHO_TOKEN_BASE_ADDRESS,
            assetName: 'MORPHO',
            apy: 0,
          },
          {
            asset: '0x1234',
            assetName: 'RewardToken',
            apy: 0.02,
          },
        ],
      });
    });
  });

  it('returns error status when contract reads fail', () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: undefined,
      status: 'error',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>);

    const { result } = renderHook(() => useMorphoVault(mockParams), {
      wrapper: getNewReactQueryTestProvider(),
    });

    expect(result.current.status).toBe('error');
  });

  it('handles undefined Morpho API result', () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: [{ result: undefined }, { result: 'Morpho Vault' }, { result: 18 }],
      status: 'success',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>);

    const { result } = renderHook(() => useMorphoVault(mockParams), {
      wrapper: getNewReactQueryTestProvider(),
    });

    expect(result.current.rewards).toEqual([
      {
        asset: MORPHO_TOKEN_BASE_ADDRESS,
        assetName: 'MORPHO',
        apy: 0,
      },
    ]);
  });

  it('correctly formats deposits when data is available', async () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: [
        { result: DUMMY_ADDRESS },
        { result: 'Morpho Vault' },
        { result: 18 }, // decimals
      ],
      status: 'success',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>);

    vi.mocked(useReadContract).mockReturnValue({
      data: 1000000000000000000n,
    } as UseReadContractReturnType<unknown[], string, unknown[], unknown>);

    (fetchMorphoApy as Mock).mockResolvedValue({
      state: {
        totalAssets: '2000000000000000000', // 2 tokens
        netApy: 0.05,
        netApyWithoutRewards: 0.03,
        rewards: [],
      },
      asset: {
        decimals: 18,
        symbol: 'DUMMY',
        address: DUMMY_ADDRESS,
      },
      liquidity: {
        underlying: '100000',
      },
    });

    const { result } = renderHook(() => useMorphoVault(mockParams), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await vi.waitFor(() => {
      expect(result.current.deposits).toBe('2');
    });
  });

  it('returns undefined deposits when data is missing', async () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: [
        { result: DUMMY_ADDRESS },
        { result: 'Morpho Vault' },
        { result: 18 },
      ],
      status: 'success',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>);

    (fetchMorphoApy as Mock).mockResolvedValue({
      state: {
        totalAssets: undefined,
        netApy: 0.05,
        netApyWithoutRewards: 0.03,
        rewards: [],
      },
    });

    const { result } = renderHook(() => useMorphoVault(mockParams), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await vi.waitFor(() => {
      expect(result.current.deposits).toBeUndefined();
    });
  });
});
