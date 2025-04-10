import { getNewReactQueryTestProvider } from '@/identity/hooks/getNewReactQueryTestProvider';
import { renderHook, waitFor } from '@testing-library/react';
import { type Chain, parseEther, parseUnits } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useConfig, useSwitchChain, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { EXTRA_DATA } from '../constants';
import { useDeposit } from './useDeposit';

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
}));

const mockWriteContractAsync = vi.fn();
const mockSwitchChainAsync = vi.fn();

const wrapper = getNewReactQueryTestProvider();

const mockAppchainConfig = {
  chainId: 1,
  contracts: {
    l2OutputOracle: '0xOutputOracle',
    systemConfig: '0xSystemConfig',
    optimismPortal: '0xOptimismPortal',
    l1CrossDomainMessenger: '0xCrossDomainMessenger',
    l1StandardBridge: '0xStandardBridge',
    l1ERC721Bridge: '0xERC721Bridge',
    optimismMintableERC20Factory: '0xERC20Factory',
  },
} as const;
const mockChain = {
  id: 1,
  name: 'Base',
  nativeCurrency: {
    name: 'Base',
    symbol: 'ETH',
    decimals: 18,
  },
} as Chain;
const mockBridgeParams = {
  token: {
    address: '0x123',
    remoteToken: '0x456',
    decimals: 18,
    chainId: 1,
    image: '',
    name: 'Mock Token',
    symbol: 'MOCK',
  },
  amount: '1',
  recipient: '0x789',
  amountUSD: '100',
} as const;

describe('useDeposit', () => {
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
    const { result } = renderHook(() => useDeposit(), { wrapper });
    await expect(
      result.current.deposit({
        config: mockAppchainConfig,
        from: mockChain,
        bridgeParams: { ...mockBridgeParams, recipient: undefined },
      }),
    ).rejects.toThrow('Recipient is required');
  });

  it('should switch chain if not on correct network', async () => {
    const { result } = renderHook(() => useDeposit(), { wrapper });
    await result.current.deposit({
      config: mockAppchainConfig,
      from: { ...mockChain, id: 2 },
      bridgeParams: mockBridgeParams,
    });
    expect(mockSwitchChainAsync).toHaveBeenCalledWith({ chainId: 2 });
  });

  it('should handle native ETH deposits correctly', async () => {
    const { result } = renderHook(() => useDeposit(), { wrapper });
    await result.current.deposit({
      config: mockAppchainConfig,
      from: mockChain,
      bridgeParams: {
        ...mockBridgeParams,
        token: { ...mockBridgeParams.token, address: '' },
      },
    });
    expect(mockWriteContractAsync).toHaveBeenCalledWith({
      abi: expect.any(Array),
      functionName: 'bridgeETHTo',
      args: [mockBridgeParams.recipient, 100000, EXTRA_DATA],
      address: mockAppchainConfig.contracts.l1StandardBridge,
      value: parseEther(mockBridgeParams.amount),
      chainId: mockChain.id,
    });
  });

  it('should handle ERC20 deposits correctly', async () => {
    const { result } = renderHook(() => useDeposit(), { wrapper });
    await result.current.deposit({
      config: mockAppchainConfig,
      from: mockChain,
      bridgeParams: mockBridgeParams,
    });
    expect(mockWriteContractAsync).toHaveBeenCalledWith({
      abi: expect.any(Array),
      functionName: 'approve',
      args: [
        mockAppchainConfig.contracts.l1StandardBridge,
        parseUnits(mockBridgeParams.amount, mockBridgeParams.token.decimals),
      ],
      address: mockBridgeParams.token.address,
    });
    expect(mockWriteContractAsync).toHaveBeenCalledWith({
      abi: expect.any(Array),
      functionName: 'bridgeERC20To',
      args: [
        mockBridgeParams.token.address,
        mockBridgeParams.token.remoteToken,
        mockBridgeParams.recipient,
        parseUnits(mockBridgeParams.amount, mockBridgeParams.token.decimals),
        100000,
        EXTRA_DATA,
      ],
      address: mockAppchainConfig.contracts.l1StandardBridge,
    });
  });

  it('should update status correctly through the deposit flow', async () => {
    const { result } = renderHook(() => useDeposit(), { wrapper });
    expect(result.current.depositStatus).toBe('idle');
    await result.current.deposit({
      config: mockAppchainConfig,
      from: mockChain,
      bridgeParams: {
        ...mockBridgeParams,
        token: { ...mockBridgeParams.token, address: '' },
      },
    });
    await waitFor(() => {
      expect(result.current.depositStatus).toBe('depositSuccess');
    });
  });

  it('should expose transaction hash', async () => {
    const { result } = renderHook(() => useDeposit(), { wrapper });
    await result.current.deposit({
      config: mockAppchainConfig,
      from: mockChain,
      bridgeParams: {
        ...mockBridgeParams,
        token: { ...mockBridgeParams.token, address: '' },
      },
    });
    expect(result.current.transactionHash).toBe('0xmocktxhash');
  });

  it('should reset deposit status when called', () => {
    const { result } = renderHook(() => useDeposit(), { wrapper });

    // Set some non-idle status first
    result.current.deposit({
      config: mockAppchainConfig,
      from: mockChain,
      bridgeParams: mockBridgeParams,
    });

    // Reset status
    result.current.resetDepositStatus();

    expect(result.current.depositStatus).toBe('idle');
  });

  it('should throw error if remote token address is missing for ERC20', async () => {
    const { result } = renderHook(() => useDeposit(), { wrapper });
    await result.current.deposit({
      config: mockAppchainConfig,
      from: mockChain,
      bridgeParams: {
        ...mockBridgeParams,
        token: { ...mockBridgeParams.token, remoteToken: undefined },
      },
    });
    await waitFor(() => {
      expect(result.current.depositStatus).toBe('error');
    });
  });

  it('should handle user rejection', async () => {
    const mockError = {
      cause: {
        name: 'UserRejectedRequestError',
      },
      message: 'Request denied.',
    };
    mockWriteContractAsync.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDeposit(), { wrapper });
    await result.current.deposit({
      config: mockAppchainConfig,
      from: mockChain,
      bridgeParams: mockBridgeParams,
    });

    await waitFor(() => {
      expect(result.current.depositStatus).toBe('depositRejected');
    });
  });

  it('should handle other errors', async () => {
    const mockError = {
      cause: new Error('Some other error'),
      message: 'Something went wrong. Please try again.',
    };
    mockWriteContractAsync.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDeposit(), { wrapper });
    await result.current.deposit({
      config: mockAppchainConfig,
      from: mockChain,
      bridgeParams: mockBridgeParams,
    });

    await waitFor(() => {
      expect(result.current.depositStatus).toBe('error');
    });
  });

  it('should handle custom gas token deposits correctly', async () => {
    const { result } = renderHook(() => useDeposit(), { wrapper });
    await result.current.deposit({
      config: mockAppchainConfig,
      from: mockChain,
      bridgeParams: {
        ...mockBridgeParams,
        token: { ...mockBridgeParams.token, isCustomGasToken: true },
      },
    });

    expect(mockWriteContractAsync).toHaveBeenCalledWith({
      abi: expect.any(Array),
      functionName: 'approve',
      args: [
        mockAppchainConfig.contracts.optimismPortal,
        parseUnits(mockBridgeParams.amount, mockBridgeParams.token.decimals),
      ],
      address: mockBridgeParams.token.address,
    });

    expect(mockWriteContractAsync).toHaveBeenCalledWith({
      abi: expect.any(Array),
      functionName: 'depositERC20Transaction',
      args: [
        mockBridgeParams.recipient,
        parseUnits(mockBridgeParams.amount, mockBridgeParams.token.decimals),
        parseUnits(mockBridgeParams.amount, mockBridgeParams.token.decimals),
        BigInt(100000),
        false,
        EXTRA_DATA,
      ],
      address: mockAppchainConfig.contracts.optimismPortal,
    });
  });
});
