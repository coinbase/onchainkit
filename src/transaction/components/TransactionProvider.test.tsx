import { render, waitFor, act } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WagmiProvider } from 'wagmi';
import { createConfig, http } from 'wagmi/actions';
import { mainnet } from 'wagmi/chains';
import { useWriteContract } from '../hooks/useWriteContract';
import { useWriteContracts } from '../hooks/useWriteContracts';
import { useCallsStatus } from '../hooks/useCallsStatus';
import type { TransactionContextType } from '../types';
import {
  TransactionProvider,
  useTransactionContext,
} from './TransactionProvider';

// Mock wagmi hooks
vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');
  return {
    ...actual,
    useAccount: vi.fn(() => ({ address: '0x123', chainId: 1 })),
    useSwitchChain: vi.fn(() => ({ switchChainAsync: vi.fn() })),
  };
});

vi.mock('../hooks/useWriteContracts', () => ({
  useWriteContracts: vi.fn(),
  genericErrorMessage: 'Something went wrong. Please try again.',
}));

vi.mock('../hooks/useWriteContract', () => ({
  useWriteContract: vi.fn(),
}));

vi.mock('../hooks/useCallsStatus', () => ({
  useCallsStatus: vi.fn(),
}));

vi.mock('../../internal/hooks/useValue', () => ({
  useValue: vi.fn((value) => value),
}));

const mockUseWriteContracts = vi.mocked(useWriteContracts);
const mockUseWriteContract = vi.mocked(useWriteContract);
const mockUseCallsStatus = vi.mocked(useCallsStatus);

// Create a mock wagmi config
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

describe('TransactionProvider', () => {
  let providedContext: TransactionContextType | undefined;

  const TestComponent: React.FC = () => {
    const context = useTransactionContext();
    providedContext = context;
    return null;
  };

  const WrappedTestComponent: React.FC<{
    address: string;
    contracts: any[];
    onError: () => void;
    chainId?: number;
  }> = ({ address, contracts, onError, chainId }) => (
    <WagmiProvider config={config}>
      <TransactionProvider address={address} contracts={contracts} onError={onError} chainId={chainId}>
        <TestComponent />
      </TransactionProvider>
    </WagmiProvider>
  );

  beforeEach(() => {
    providedContext = undefined;
    vi.clearAllMocks();
  });

  it('should provide the transaction context to its children', () => {
    render(<WrappedTestComponent address="0x123" contracts={[]} onError={() => {}} />);

    expect(providedContext).toBeDefined();
    if (providedContext) {
      expect(providedContext.address).toBe('0x123');
      expect(providedContext.contracts).toEqual([]);
      expect(providedContext.isLoading).toBe(false);
      expect(providedContext.status).toBe('idle');
      expect(providedContext.transactionHash).toBeNull();
      expect(typeof providedContext.onSubmit).toBe('function');
      expect(typeof providedContext.setErrorMessage).toBe('function');
      expect(typeof providedContext.setIsToastVisible).toBe('function');
      expect(typeof providedContext.setTransactionId).toBe('function');
    }
  });

  it('should call writeContracts on onSubmit', async () => {
    const mockWriteContractsAsync = vi.fn();
    mockUseWriteContracts.mockReturnValue({
      status: 'idle',
      writeContractsAsync: mockWriteContractsAsync,
    });

    const testContracts = [
      {
        abi: [{ name: 'safeMint', inputs: [], outputs: [] }],
        address: '0x123',
        functionName: 'safeMint',
      },
    ];
    
    render(<WrappedTestComponent address="0x123" contracts={testContracts} onError={() => {}} />);

    await act(async () => {
      await providedContext?.onSubmit();
    });

    await waitFor(() => {
      expect(mockWriteContractsAsync).toHaveBeenCalledWith({
        contracts: testContracts,
        capabilities: undefined,
      });
    });
  });

  it('should fallback to writeContract for EOA accounts', async () => {
    const mockWriteContractsAsync = vi.fn().mockRejectedValue(new Error('Method not supported'));
    const mockWriteContract = vi.fn();
    mockUseWriteContracts.mockReturnValue({
      status: 'idle',
      writeContractsAsync: mockWriteContractsAsync,
    });
    mockUseWriteContract.mockReturnValue({
      status: 'idle',
      writeContract: mockWriteContract,
      data: null,
    });

    const testContracts = [
      {
        abi: [{ name: 'safeMint', inputs: [], outputs: [] }],
        address: '0x123',
        functionName: 'safeMint',
      },
      {
        abi: [{ name: 'safeMint', inputs: [], outputs: [] }],
        address: '0x456',
        functionName: 'safeMint',
      },
    ];

    render(<WrappedTestComponent address="0x123" contracts={testContracts} onError={() => {}} />);

    await act(async () => {
      await providedContext?.onSubmit();
    });

    await waitFor(() => {
      expect(mockWriteContractsAsync).toHaveBeenCalledWith({
        contracts: testContracts,
        capabilities: undefined,
      });
    });

    await waitFor(() => {
      expect(mockWriteContract).toHaveBeenCalledTimes(2);
    });

    expect(mockWriteContract).toHaveBeenNthCalledWith(1, testContracts[0]);
    expect(mockWriteContract).toHaveBeenNthCalledWith(2, testContracts[1]);
  });

  it('should switch chain if necessary before executing contracts', async () => {
    const mockSwitchChainAsync = vi.fn();
    const mockWriteContractsAsync = vi.fn();
    vi.mocked(useAccount).mockReturnValue({ address: '0x123', chainId: 1 });
    vi.mocked(useSwitchChain).mockReturnValue({ switchChainAsync: mockSwitchChainAsync });
    mockUseWriteContracts.mockReturnValue({
      status: 'idle',
      writeContractsAsync: mockWriteContractsAsync,
    });

    render(<WrappedTestComponent address="0x123" contracts={[]} onError={() => {}} chainId={5} />);

    await act(async () => {
      await providedContext?.onSubmit();
    });

    await waitFor(() => {
      expect(mockSwitchChainAsync).toHaveBeenCalledWith({ chainId: 5 });
      expect(mockWriteContractsAsync).toHaveBeenCalled();
    });
  });

  it('should set error message on failure', async () => {
    const mockWriteContractsAsync = vi.fn().mockRejectedValue(new Error('Test error'));
    mockUseWriteContracts.mockReturnValue({
      status: 'idle',
      writeContractsAsync: mockWriteContractsAsync,
    });

    render(<WrappedTestComponent address="0x123" contracts={[]} onError={() => {}} />);

    await act(async () => {
      await providedContext?.onSubmit();
    });

    await waitFor(() => {
      expect(providedContext?.errorMessage).toBe('Something went wrong. Please try again.');
    });
  });

  it('should update status based on useCallsStatus', async () => {
    mockUseCallsStatus.mockReturnValue({ status: 'PENDING', transactionHash: null });

    render(<WrappedTestComponent address="0x123" contracts={[]} onError={() => {}} />);

    expect(providedContext?.isLoading).toBe(true);

    mockUseCallsStatus.mockReturnValue({ status: 'SUCCESS', transactionHash: '0xabc' });

    render(<WrappedTestComponent address="0x123" contracts={[]} onError={() => {}} />);

    expect(providedContext?.isLoading).toBe(false);
    expect(providedContext?.transactionHash).toBe('0xabc');
  });
});