import type { Token } from '@/token';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { type Chain, parseEther } from 'viem';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useConfig } from 'wagmi';
import { getBalance, readContract } from 'wagmi/actions';
import { useChainConfig } from '../hooks/useAppchainConfig';
import { useDeposit } from '../hooks/useDeposit';
import { useWithdraw } from '../hooks/useWithdraw';
import type { Appchain, BridgeableToken } from '../types';
import {
  AppchainBridgeProvider,
  useAppchainBridgeContext,
} from './AppchainBridgeProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConfig: vi.fn(),
}));

vi.mock('wagmi/actions', () => ({
  getBalance: vi.fn(),
  readContract: vi.fn(),
}));

vi.mock('../hooks/useAppchainConfig', () => ({
  useChainConfig: vi.fn(),
}));

vi.mock('../hooks/useDeposit', () => ({
  useDeposit: vi.fn(),
}));

vi.mock('../hooks/useWithdraw', () => ({
  useWithdraw: vi.fn(),
}));

vi.mock('../utils/getETHPrice', () => ({
  getETHPrice: vi.fn().mockResolvedValue('2000'),
}));

const mockChain = {
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
} as Chain;

const mockAppchain = {
  chain: {
    id: 8453,
    name: 'Base',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
} as Appchain;

const mockConfig = {
  chainId: 8453,
  contracts: {
    l2OutputOracle: '0x123',
    systemConfig: '0x456',
    optimismPortal: '0x789',
  },
};

const mockToken = {
  address: '',
  symbol: 'ETH',
  decimals: 18,
  chainId: 1,
  image: '',
  name: 'ETH',
} as Token;

const mockBridgeableTokens = [mockToken];

describe('AppchainBridgeProvider', () => {
  let result: {
    current: ReturnType<typeof useAppchainBridgeContext>;
  };

  const renderBridgeProvider = async (props = {}) => {
    let hookResult!: {
      current: ReturnType<typeof useAppchainBridgeContext>;
    };
    await act(async () => {
      const rendered = renderHook(() => useAppchainBridgeContext(), {
        wrapper: ({ children }) => (
          <AppchainBridgeProvider
            chain={mockChain}
            appchain={mockAppchain}
            bridgeableTokens={mockBridgeableTokens}
            {...props}
          >
            {children}
          </AppchainBridgeProvider>
        ),
      });
      hookResult = rendered.result;
    });
    return hookResult;
  };

  beforeEach(async () => {
    vi.resetAllMocks();
    vi.stubGlobal('open', vi.fn());

    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
      address: '0x123',
    });
    (useConfig as ReturnType<typeof vi.fn>).mockReturnValue({});
    (useChainConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      config: mockConfig,
      error: null,
    });
    (useDeposit as ReturnType<typeof vi.fn>).mockReturnValue({
      deposit: vi.fn(),
      depositStatus: 'idle',
      resetDepositStatus: vi.fn(),
    });
    (useWithdraw as ReturnType<typeof vi.fn>).mockReturnValue({
      withdraw: vi.fn(),
      withdrawStatus: 'idle',
      resetWithdrawStatus: vi.fn(),
      waitForWithdrawal: vi.fn(),
      proveAndFinalizeWithdrawal: vi.fn(),
    });
    (getBalance as ReturnType<typeof vi.fn>).mockResolvedValue({
      value: parseEther('1'),
      decimals: 18,
    });
    (readContract as ReturnType<typeof vi.fn>).mockResolvedValue(
      parseEther('1'),
    );

    result = await renderBridgeProvider();
  });

  it('should throw error when used outside provider', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    expect(() => {
      renderHook(() => useAppchainBridgeContext());
    }).toThrow('useAppchainBridge must be used within a BridgeProvider');
    consoleErrorSpy.mockRestore();
  });

  it('should initialize with correct default values', async () => {
    await waitFor(() => {
      expect(result.current.from.id).toBe(mockChain.id);
      expect(result.current.to.id).toBe(mockAppchain.chain.id);
      expect(result.current.bridgeParams.amount).toBe('');
      expect(result.current.bridgeParams.amountUSD).toBe('0.00');
    });
  });

  it('should update recipient when wallet connects', async () => {
    await waitFor(() => {
      expect(result.current.bridgeParams.recipient).toBe('0x123');
    });
  });

  it('should handle network toggle correctly', async () => {
    const initialFromId = result.current.from.id;
    const initialToId = result.current.to.id;

    act(() => {
      result.current.handleToggle();
    });

    await waitFor(() => {
      expect(result.current.from.id).toBe(initialToId);
      expect(result.current.to.id).toBe(initialFromId);
    });
  });

  it('should handle amount changes with price updates', async () => {
    result = await renderBridgeProvider({
      handleFetchPrice: () => Promise.resolve('2000.00'),
    });

    await waitFor(async () => {
      result.current.handleAmountChange({
        amount: '1',
        token: mockToken,
      });
    });

    await waitFor(() => {
      expect(result.current.bridgeParams.amount).toBe('1');
      expect(result.current.bridgeParams.amountUSD).toBe('2000.00');
    });
  });

  it('should handle withdraw modal state changes', async () => {
    await waitFor(async () => {
      result.current.setIsWithdrawModalOpen(true);
    });
    expect(result.current.isWithdrawModalOpen).toBe(true);

    await waitFor(async () => {
      result.current.setIsWithdrawModalOpen(false);
    });
    expect(result.current.isWithdrawModalOpen).toBe(false);
  });

  it('should handle address modal state changes', async () => {
    await waitFor(async () => {
      result.current.setIsAddressModalOpen(true);
      expect(result.current.isAddressModalOpen).toBe(true);
    });

    await waitFor(async () => {
      result.current.handleAddressSelect('0x456' as `0x${string}`);
      expect(result.current.bridgeParams.recipient).toBe('0x456');
    });
  });

  it('should call deposit function when handleDeposit is called', async () => {
    const mockDeposit = vi.fn();
    (useDeposit as Mock).mockReturnValue({
      deposit: mockDeposit,
      depositStatus: 'idle',
      transactionHash: '',
      resetDepositStatus: vi.fn(),
    });
    const result = await renderBridgeProvider();
    await waitFor(async () => {
      result.current.handleDeposit();
    });
    expect(mockDeposit).toHaveBeenCalled();
  });

  it('should set resumeWithdrawalTxHash when handleResumeTransaction is called', async () => {
    const result = await renderBridgeProvider();
    await waitFor(async () => {
      result.current.handleResumeTransaction(
        '0x1234567890123456789012345678901234567890123456789012345678901234',
      );
    });
    expect(result.current.resumeWithdrawalTxHash).toBe(
      '0x1234567890123456789012345678901234567890123456789012345678901234',
    );
    expect(result.current.isResumeTransactionModalOpen).toBe(false);
  });

  it('should validate required props', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {}); // Suppress error logging
    expect(() => {
      renderHook(() => useAppchainBridgeContext(), {
        wrapper: ({ children }) => (
          <AppchainBridgeProvider
            chain={mockChain}
            appchain={mockAppchain}
            bridgeableTokens={[]}
          >
            {children}
          </AppchainBridgeProvider>
        ),
      });
    }).toThrow(
      'Bridgeable tokens must be provided as a parameter to AppchainBridge.',
    );
    consoleErrorSpy.mockRestore(); // Restore console.error after test
  });

  it('should throw error when chain config has error', () => {
    (useChainConfig as Mock).mockReturnValue({
      config: null,
      error: new Error('Chain config error'),
    });
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {}); // Suppress error logging
    expect(() => {
      renderHook(() => useAppchainBridgeContext(), {
        wrapper: ({ children }) => (
          <AppchainBridgeProvider
            chain={mockChain}
            appchain={mockAppchain}
            bridgeableTokens={mockBridgeableTokens}
          >
            {children}
          </AppchainBridgeProvider>
        ),
      });
    }).toThrow(
      'Error loading chain configuration. Ensure you have the correct chain ID.',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      new Error('Chain config error'),
    );
    consoleErrorSpy.mockRestore(); // Restore console.error after test
  });

  it('should render empty fragment when config is null', async () => {
    (useChainConfig as Mock).mockReturnValue({
      config: null,
      error: null,
    });
    const result = await renderBridgeProvider();
    expect(result.current).toBeNull();
  });

  it('should not fetch balance when address is not set', async () => {
    (useAccount as Mock).mockReturnValue({
      address: '',
    });
    const result = await renderBridgeProvider();
    expect(result.current.balance).toBe('');
  });

  it('should fetch ERC-20 balance correctly', async () => {
    // Mock an ERC-20 token
    const mockERC20Token = {
      ...mockToken,
      address: '0xTokenAddress',
      decimals: 6,
    } as BridgeableToken;
    // Mock readContract to return a specific balance
    (readContract as Mock).mockResolvedValue(1000000n);
    const result = await renderBridgeProvider({
      bridgeableTokens: [mockERC20Token],
    });
    // Wait for the balance to be fetched
    await waitFor(() => {
      expect(readContract).toHaveBeenCalledWith(expect.anything(), {
        abi: expect.arrayContaining([
          expect.objectContaining({
            name: 'balanceOf',
          }),
        ]),
        address: '0xTokenAddress',
        args: ['0x123'],
        chainId: mockChain.id,
        functionName: 'balanceOf',
      });
      expect(result.current.balance).toBe('1');
    });
  });

  it('should fetch native gas token balance correctly for withdrawals', async () => {
    // Mock an ERC-20 token that's a custom gas token
    const mockERC20Token = {
      ...mockToken,
      address: '0xTokenAddress',
      decimals: 6,
      isCustomGasToken: true,
    } as BridgeableToken;

    (getBalance as Mock).mockResolvedValue({
      value: 1000000000000n,
      decimals: 18,
    });

    const result = await renderBridgeProvider({
      bridgeableTokens: [mockERC20Token],
    });

    // Wait for the balance to be fetched
    await waitFor(async () => {
      result.current.handleToggle();
    });

    expect(getBalance).toHaveBeenCalledWith(expect.anything(), {
      address: '0x123',
      chainId: mockChain.id,
    });
    expect(result.current.direction).toBe('withdraw');
    expect(result.current.bridgeParams.token).toBe(mockERC20Token);
  });

  it('should call withdraw function when handleWithdraw is called', async () => {
    const mockWithdraw = vi.fn();
    (useWithdraw as Mock).mockReturnValue({
      withdraw: mockWithdraw,
      withdrawStatus: 'idle',
      resetWithdrawStatus: vi.fn(),
    });
    const result = await renderBridgeProvider();
    await waitFor(async () => {
      result.current.handleWithdraw();
    });
    expect(mockWithdraw).toHaveBeenCalled();
  });

  it('should open withdraw modal when withdraw is successful', async () => {
    (useWithdraw as Mock).mockReturnValue({
      withdrawStatus: 'withdrawSuccess',
      resetWithdrawStatus: vi.fn(),
    });
    const result = await renderBridgeProvider();
    await waitFor(async () => {
      expect(result.current.isWithdrawModalOpen).toBe(true);
    });
  });

  it('should open success modal when withdraw is successful', async () => {
    (useWithdraw as Mock).mockReturnValue({
      withdrawStatus: 'claimSuccess',
      resetWithdrawStatus: vi.fn(),
    });
    const result = await renderBridgeProvider();
    await waitFor(async () => {
      expect(result.current.isSuccessModalOpen).toBe(true);
    });
  });

  it('should open the correct explorer', async () => {
    const baseChain = {
      ...mockChain,
      id: 8453, // Base mainnet chain ID
    };
    const baseResult = await renderBridgeProvider({
      chain: baseChain,
      appchain: mockAppchain,
    });
    await waitFor(async () => {
      baseResult.current.handleOpenExplorer();
    });
    expect(window.open).toHaveBeenCalledWith(
      'https://basescan.org/tx/undefined',
      '_blank',
    );
    // Reset mocks
    vi.clearAllMocks();
    const sepoliaChain = {
      ...mockChain,
      id: 84532, // Base Sepolia chain ID
    };
    const sepoliaResult = await renderBridgeProvider({
      chain: sepoliaChain,
      appchain: mockAppchain,
    });
    await waitFor(async () => {
      sepoliaResult.current.handleOpenExplorer();
    });
    expect(window.open).toHaveBeenCalledWith(
      'https://sepolia.basescan.org/tx/undefined',
      '_blank',
    );
  });

  it('should open the correct explorer when deposit is successful', async () => {
    const mockDeposit = vi.fn();
    (useDeposit as Mock).mockReturnValue({
      deposit: mockDeposit,
      depositStatus: 'depositSuccess',
      transactionHash: '0x123',
      resetDepositStatus: vi.fn(),
    });

    const result = await renderBridgeProvider();
    await waitFor(async () => {
      result.current.handleOpenExplorer();
    });
    expect(window.open).toHaveBeenCalledWith(
      'https://sepolia.basescan.org/tx/0x123',
      '_blank',
    );
  });

  it('should open the correct explorer when withdrawal is successful', async () => {
    const mockWithdraw = vi.fn();
    (useWithdraw as Mock).mockReturnValue({
      withdraw: mockWithdraw,
      withdrawStatus: 'withdrawSuccess',
      finalizedWithdrawalTxHash: '0x123',
      resetWithdrawStatus: vi.fn(),
    });
    const result = await renderBridgeProvider();
    await waitFor(async () => {
      result.current.handleOpenExplorer();
    });
    expect(window.open).toHaveBeenCalledWith(
      'https://sepolia.basescan.org/tx/0x123',
      '_blank',
    );
  });

  it('should reset state when handleResetState is called', async () => {
    const result = await renderBridgeProvider();
    await waitFor(async () => {
      result.current.handleResetState();
    });
    expect(result.current.resumeWithdrawalTxHash).toBeUndefined();
    expect(result.current.isWithdrawModalOpen).toBe(false);
    expect(result.current.isSuccessModalOpen).toBe(false);
    expect(result.current.isResumeTransactionModalOpen).toBe(false);
  });
});
