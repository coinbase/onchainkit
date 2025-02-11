import { useMorphoVault } from '@/earn/hooks/useMorphoVault';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook } from '@testing-library/react';
import { act } from 'react';
import { baseSepolia } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, WagmiProvider, createConfig, mock, useAccount } from 'wagmi';
import { EarnProvider, useEarnContext } from './EarnProvider';

const DUMMY_ADDRESS = '0x9E95f497a7663B70404496dB6481c890C4825fe1' as const;
const queryClient = new QueryClient();

const mockConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    mock({
      accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={mockConfig}>
    <QueryClientProvider client={queryClient}>
      <EarnProvider vaultAddress={DUMMY_ADDRESS}>{children}</EarnProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

vi.mock('@/wallet/hooks/useGetTokenBalance', () => ({
  useGetTokenBalance: vi.fn(),
}));

vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
    useConfig: vi.fn(),
  };
});

vi.mock('@/earn/hooks/useMorphoVault', () => ({
  useMorphoVault: vi.fn(),
}));

describe('EarnProvider', () => {
  beforeEach(() => {
    (useAccount as Mock).mockReturnValue({
      address: DUMMY_ADDRESS,
    });
    (useGetTokenBalance as Mock).mockReturnValue({
      convertedBalance: '0.0',
      error: null,
    });
  });

  it('throws an error when vaultAddress is not provided', () => {
    expect(() =>
      renderHook(() => useEarnContext(), {
        wrapper: ({ children }) => (
          // @ts-expect-error - vaultAddress is not provided
          <EarnProvider vaultAddress={undefined}>{children}</EarnProvider>
        ),
      }),
    ).toThrow('vaultAddress is required');
  });

  it('provides vault address through context', () => {
    (useMorphoVault as Mock).mockReturnValue({
      asset: DUMMY_ADDRESS,
      assetDecimals: 18,
      assetSymbol: 'TEST',
      balance: '100',
      totalApy: '0.05',
    });
    const { result } = renderHook(() => useEarnContext(), { wrapper });

    expect(result.current.vaultAddress).toBe(DUMMY_ADDRESS);
  });

  it('throws error when useEarnContext is used outside of provider', () => {
    expect(() => renderHook(() => useEarnContext())).toThrow(
      'useEarnContext must be used within an EarnProvider',
    );
  });

  it('handles case when asset exists', () => {
    (useMorphoVault as Mock).mockReturnValue({
      asset: DUMMY_ADDRESS,
      assetDecimals: 18,
      assetSymbol: 'TEST',
      balance: '100',
      totalApy: '0.05',
    });

    render(
      <EarnProvider vaultAddress={DUMMY_ADDRESS}>
        <div>Child</div>
      </EarnProvider>,
    );
  });

  it('returns undefined vaultToken when asset is undefined', () => {
    (useMorphoVault as Mock).mockReturnValue({
      vaultToken: undefined,
    });
    const { result } = renderHook(() => useEarnContext(), { wrapper });

    expect(result.current.vaultToken).toBeUndefined();
  });

  it('updates lifecycle status and deposit amount when handleDepositAmount is called', async () => {
    (useMorphoVault as Mock).mockReturnValue({
      asset: DUMMY_ADDRESS,
      assetDecimals: 18,
      assetSymbol: 'TEST',
      balance: '100',
      totalApy: '0.05',
    });

    const { result } = renderHook(() => useEarnContext(), { wrapper });

    await act(async () => {
      result.current.setDepositAmount('100');
    });

    expect(result.current.depositAmount).toBe('100');
    expect(result.current.lifecycleStatus).toEqual({
      statusName: 'amountChange',
      statusData: {
        amount: '100',
        token: result.current.vaultToken,
      },
    });
  });

  it('updates lifecycle status and withdraw amount when handleWithdrawAmount is called', async () => {
    (useMorphoVault as Mock).mockReturnValue({
      asset: DUMMY_ADDRESS,
      assetDecimals: 18,
      assetSymbol: 'TEST',
      balance: '100',
      totalApy: '0.05',
    });

    const { result } = renderHook(() => useEarnContext(), { wrapper });

    await act(async () => {
      result.current.setWithdrawAmount('50');
    });

    expect(result.current.withdrawAmount).toBe('50');
    expect(result.current.lifecycleStatus).toEqual({
      statusName: 'amountChange',
      statusData: {
        amount: '50',
        token: result.current.vaultToken,
      },
    });
  });

  // Input validation
  // Deposit
  it('returns an error when depositAmount is set to 0', async () => {
    const { result } = renderHook(() => useEarnContext(), { wrapper });

    await act(async () => {
      result.current.setDepositAmount('0');
    });

    expect(result.current.depositAmountError).toBe('Must be greater than 0');
  });

  it('returns null when depositAmount is set to a positive number less than or equal to underlyingBalance', async () => {
    (useGetTokenBalance as Mock).mockReturnValue({
      convertedBalance: '100',
    });

    const { result } = renderHook(() => useEarnContext(), { wrapper });

    await act(async () => {
      result.current.setDepositAmount('10');
    });

    expect(result.current.depositAmountError).toBeNull();
  });

  // Withdraw
  it('returns an error when withdrawAmount is set to 0', async () => {
    const { result } = renderHook(() => useEarnContext(), { wrapper });

    await act(async () => {
      result.current.setWithdrawAmount('0');
    });

    expect(result.current.withdrawAmountError).toBe('Must be greater than 0');
  });

  it('returns an error when withdrawAmount is greater than receiptBalance', async () => {
    (useMorphoVault as Mock).mockReturnValue({
      balance: '1',
    });

    const { result } = renderHook(() => useEarnContext(), { wrapper });

    await act(async () => {
      result.current.setWithdrawAmount('2');
    });

    expect(result.current.withdrawAmountError).toBe(
      'Amount exceeds the balance',
    );
  });

  it('passes token decimals to withdrawCalls when vaultToken exists', () => {
    (useMorphoVault as Mock).mockReturnValue({
      asset: {
        address: DUMMY_ADDRESS,
        decimals: 18,
        symbol: 'TEST',
      },
      balance: '100',
      totalApy: '0.05',
    });

    const { result } = renderHook(() => useEarnContext(), { wrapper });
    expect(result.current.vaultToken?.decimals).toBe(18);
  });

  it('handles undefined token decimals in withdrawCalls when vaultToken is undefined', () => {
    (useMorphoVault as Mock).mockReturnValue({
      asset: undefined,
      balance: '100',
      totalApy: '0.05',
    });

    const { result } = renderHook(() => useEarnContext(), { wrapper });
    expect(result.current.vaultToken).toBeUndefined();
  });
});
