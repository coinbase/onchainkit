import { getNewReactQueryTestProvider } from '@/identity/hooks/getNewReactQueryTestProvider';
import { renderHook, waitFor } from '@testing-library/react';
import type { Address, Chain, Hex } from 'viem';
import { parseEther } from 'viem';
import { getWithdrawals } from 'viem/op-stack';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useConfig, useSwitchChain, useWriteContract } from 'wagmi';
import { readContract, waitForTransactionReceipt } from 'wagmi/actions';
import {
  APPCHAIN_BRIDGE_ADDRESS,
  APPCHAIN_L2_TO_L1_MESSAGE_PASSER_ADDRESS,
  EXTRA_DATA,
  MIN_GAS_LIMIT,
} from '../constants';
import type { AppchainConfig, BridgeParams } from '../types';
import { useWithdraw } from './useWithdraw';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    useAccount: vi.fn(),
    useConfig: vi.fn(),
    useSwitchChain: vi.fn(),
    useWriteContract: vi.fn(),
  };
});

vi.mock('wagmi/actions', () => ({
  waitForTransactionReceipt: vi.fn(),
  readContract: vi.fn(),
}));

vi.mock('viem/op-stack', () => ({
  getWithdrawals: vi.fn(),
}));

vi.mock('../utils/getOutput', () => ({
  getOutput: vi.fn().mockResolvedValue({
    outputIndex: 1n,
    l2BlockNumber: 100n,
  }),
}));

vi.mock('wagmi/actions', () => ({
  waitForTransactionReceipt: vi.fn(),
  readContract: vi.fn(),
}));

const mockSwitchChainAsync = vi.fn();
const mockWriteContractAsync = vi.fn();

const mockChain = {
  id: 1,
  name: 'Ethereum',
} as Chain;

const mockAppchainConfig: AppchainConfig = {
  chainId: 1,
  contracts: {
    l2OutputOracle: '0x123' as Address,
    systemConfig: '0x124' as Address,
    optimismPortal: '0x125' as Address,
    l1CrossDomainMessenger: '0x126' as Address,
    l1StandardBridge: '0x127' as Address,
    l1ERC721Bridge: '0x128' as Address,
    optimismMintableERC20Factory: '0x129' as Address,
  },
};

const mockBridgeParams: BridgeParams = {
  amount: '100',
  amountUSD: '100',
  recipient: '0x456' as Address,
  token: {
    address: '0x789' as Address,
    decimals: 18,
    symbol: 'TEST',
    remoteToken: '0x790' as Address,
    chainId: 1,
    image: 'https://example.com/image.png',
    name: 'Test Token',
  },
};

const wrapper = getNewReactQueryTestProvider();

describe('useWithdraw', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({ chainId: 1 });
    (useConfig as ReturnType<typeof vi.fn>).mockReturnValue({});
    (useSwitchChain as ReturnType<typeof vi.fn>).mockReturnValue({
      switchChainAsync: mockSwitchChainAsync,
    });
    (useWriteContract as ReturnType<typeof vi.fn>).mockReturnValue({
      writeContractAsync: mockWriteContractAsync,
      data: '0xmocktxhash',
    });
    (waitForTransactionReceipt as ReturnType<typeof vi.fn>).mockResolvedValue(
      {},
    );
  });

  it('should throw error if recipient is not provided', async () => {
    const { result } = renderHook(
      () =>
        useWithdraw({
          config: mockAppchainConfig,
          chain: mockChain,
          bridgeParams: { ...mockBridgeParams, recipient: undefined },
        }),
      { wrapper },
    );
    await expect(result.current.withdraw()).rejects.toThrow(
      'Recipient is required',
    );
  });

  it('should switch chain if not on correct network', async () => {
    const { result } = renderHook(
      () =>
        useWithdraw({
          config: { ...mockAppchainConfig, chainId: 0 },
          chain: mockChain,
          bridgeParams: mockBridgeParams,
        }),
      { wrapper },
    );
    await result.current.withdraw();
    await waitFor(() => {
      expect(mockSwitchChainAsync).toHaveBeenCalledWith({ chainId: 0 });
    });
  });

  it('should handle successful ERC-20withdrawal', async () => {
    const { result } = renderHook(
      () =>
        useWithdraw({
          config: mockAppchainConfig,
          chain: mockChain,
          bridgeParams: mockBridgeParams,
        }),
      { wrapper },
    );
    await result.current.withdraw();
    await waitFor(() => {
      expect(result.current.withdrawStatus).toBe('withdrawSuccess');
    });
  });

  it('should handle withdrawal rejection', async () => {
    const mockError = {
      cause: {
        name: 'UserRejectedRequestError',
      },
      message: 'Request denied.',
    };
    mockWriteContractAsync.mockRejectedValue(mockError);

    const { result } = renderHook(
      () =>
        useWithdraw({
          config: mockAppchainConfig,
          chain: mockChain,
          bridgeParams: mockBridgeParams,
        }),
      { wrapper },
    );
    await result.current.withdraw();
    await waitFor(() => {
      expect(result.current.withdrawStatus).toBe('withdrawRejected');
    });
  });

  it('should reset withdraw status', () => {
    const { result } = renderHook(
      () =>
        useWithdraw({
          config: mockAppchainConfig,
          chain: mockChain,
          bridgeParams: mockBridgeParams,
        }),
      { wrapper },
    );
    result.current.resetWithdrawStatus();
    expect(result.current.withdrawStatus).toBe('idle');
  });

  it('should handle error states', async () => {
    mockWriteContractAsync.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(
      () =>
        useWithdraw({
          config: mockAppchainConfig,
          chain: mockChain,
          bridgeParams: mockBridgeParams,
        }),
      { wrapper },
    );
    await result.current.withdraw();
    await waitFor(() => {
      expect(result.current.withdrawStatus).toBe('error');
    });
  });

  it('should handle native ETH withdrawal', async () => {
    const nativeBridgeParams = {
      ...mockBridgeParams,
      token: {
        ...mockBridgeParams.token,
        address: '',
      },
    } as BridgeParams;
    const { result } = renderHook(
      () =>
        useWithdraw({
          config: mockAppchainConfig,
          chain: mockChain,
          bridgeParams: nativeBridgeParams,
        }),
      { wrapper },
    );
    await result.current.withdraw();
    await waitFor(() => {
      expect(mockWriteContractAsync).toHaveBeenCalledWith({
        abi: expect.arrayContaining([
          expect.objectContaining({
            name: 'bridgeETHTo',
            type: 'function',
          }),
        ]),
        functionName: 'bridgeETHTo',
        args: [nativeBridgeParams.recipient, MIN_GAS_LIMIT, EXTRA_DATA],
        address: APPCHAIN_BRIDGE_ADDRESS,
        value: parseEther(nativeBridgeParams.amount),
        chainId: mockAppchainConfig.chainId,
      });
      expect(result.current.withdrawStatus).toBe('withdrawSuccess');
    });
  });

  it('should throw error if remote token is not provided', async () => {
    const { result } = renderHook(
      () =>
        useWithdraw({
          config: mockAppchainConfig,
          chain: mockChain,
          bridgeParams: {
            ...mockBridgeParams,
            token: { ...mockBridgeParams.token, remoteToken: undefined },
          },
        }),
      { wrapper },
    );
    await result.current.withdraw();
    await waitFor(() => {
      expect(result.current.withdrawStatus).toBe('error');
    });
  });

  it('should handle waiting for withdrawal', async () => {
    const mockLatestBlockNumber = vi
      .fn()
      .mockResolvedValueOnce(5n) // First call returns lower block number
      .mockResolvedValueOnce(15n); // Second call returns higher block number
    (useWriteContract as ReturnType<typeof vi.fn>).mockReturnValue({
      writeContractAsync: mockWriteContractAsync,
      data: '0xmocktxhash',
    });
    (waitForTransactionReceipt as ReturnType<typeof vi.fn>).mockResolvedValue({
      blockNumber: 10n,
    });
    (readContract as ReturnType<typeof vi.fn>).mockImplementation(
      mockLatestBlockNumber,
    );
    (getWithdrawals as ReturnType<typeof vi.fn>).mockReturnValue([
      {
        nonce: 1n,
        sender: '0x123' as Hex,
        target: '0x456' as Hex,
        value: parseEther(mockBridgeParams.amount),
        gasLimit: 100000n,
        data: '0x' as Hex,
        withdrawalHash: '0xabc123' as Hex,
      },
    ]);
    const { result } = renderHook(
      () =>
        useWithdraw({
          config: mockAppchainConfig,
          chain: mockChain,
          bridgeParams: mockBridgeParams,
        }),
      { wrapper },
    );
    await result.current.waitForWithdrawal();
    await waitFor(() => {
      expect(result.current.withdrawStatus).toBe('claimReady');
    });
    expect(mockLatestBlockNumber).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        address: mockAppchainConfig.contracts.l2OutputOracle,
        functionName: 'latestBlockNumber',
        chainId: mockChain.id,
      }),
    );
  });

  it('should handle waiting for withdrawal when data is null', async () => {
    const mockLatestBlockNumber = vi.fn().mockResolvedValue(15n);
    (useWriteContract as ReturnType<typeof vi.fn>).mockReturnValue({
      writeContractAsync: mockWriteContractAsync,
      data: null,
    });
    (waitForTransactionReceipt as ReturnType<typeof vi.fn>).mockResolvedValue({
      blockNumber: 10n,
    });
    (readContract as ReturnType<typeof vi.fn>).mockImplementation(
      mockLatestBlockNumber,
    );
    (getWithdrawals as ReturnType<typeof vi.fn>).mockReturnValue([]);

    const { result } = renderHook(
      () =>
        useWithdraw({
          config: mockAppchainConfig,
          chain: mockChain,
          bridgeParams: mockBridgeParams,
        }),
      { wrapper },
    );

    await result.current.waitForWithdrawal();
    await waitFor(() => {
      expect(result.current.withdrawStatus).toBe('idle');
    });
  });

  it('should handle custom ERC20 gas token withdrawal', async () => {
    const customGasTokenBridgeParams = {
      ...mockBridgeParams,
      token: {
        ...mockBridgeParams.token,
        isCustomGasToken: true,
      },
    } as BridgeParams;

    const { result } = renderHook(
      () =>
        useWithdraw({
          config: mockAppchainConfig,
          chain: mockChain,
          bridgeParams: customGasTokenBridgeParams,
        }),
      { wrapper },
    );

    await result.current.withdraw();
    await waitFor(() => {
      expect(mockWriteContractAsync).toHaveBeenCalledWith({
        abi: expect.arrayContaining([
          expect.objectContaining({
            name: 'initiateWithdrawal',
            type: 'function',
          }),
        ]),
        functionName: 'initiateWithdrawal',
        args: [
          customGasTokenBridgeParams.recipient,
          BigInt(MIN_GAS_LIMIT),
          EXTRA_DATA,
        ],
        address: APPCHAIN_L2_TO_L1_MESSAGE_PASSER_ADDRESS,
        value: parseEther(customGasTokenBridgeParams.amount),
        chainId: mockAppchainConfig.chainId,
      });
      expect(result.current.withdrawStatus).toBe('withdrawSuccess');
    });
  });
});
