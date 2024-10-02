import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useAccount, useConnect, useSwitchChain } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useCallsStatus } from 'wagmi/experimental';
import { useWriteContracts } from 'wagmi/experimental';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import { useCommerceContracts } from '../hooks/useCommerceContracts';
import { PayProvider, usePayContext } from './PayProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useSwitchChain: vi.fn(),
  useWaitForTransactionReceipt: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useCallsStatus: vi.fn(),
  useWriteContracts: vi.fn(),
}));

vi.mock('../hooks/useCommerceContracts', () => ({
  useCommerceContracts: vi.fn(),
}));

const windowOpenMock = vi.fn();

const TestComponent = () => {
  const context = usePayContext();
  return (
    <div data-testid="test-component">
      <span data-testid="lifecycle-status">
        {context.lifecycleStatus?.statusName}
      </span>
      {context.lifecycleStatus?.statusName === 'error' && (
        <span data-testid="lifecycle-status-data-error">
          {context.lifecycleStatus?.statusData.message}
        </span>
      )}
      <span data-testid="error-message">{context.errorMessage}</span>
      <button onClick={context.onSubmit}>Submit</button>
    </div>
  );
};

describe('PayProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(window, 'open').mockImplementation(windowOpenMock);
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chainId: 1,
      isConnected: true,
    });
    (useConnect as Mock).mockReturnValue({
      connectAsync: vi.fn(),
      connectors: [],
    });
    (useSwitchChain as Mock).mockReturnValue({ switchChainAsync: vi.fn() });
    (useCallsStatus as Mock).mockReturnValue({ data: null });
    (useWaitForTransactionReceipt as Mock).mockReturnValue({ data: null });
    (useWriteContracts as Mock).mockReturnValue({
      status: 'idle',
      writeContractsAsync: vi.fn(),
    });
    (useCommerceContracts as Mock).mockReturnValue(() =>
      Promise.resolve({ contracts: [{}], insufficientBalance: false }),
    );
  });

  afterEach(() => {
    windowOpenMock.mockReset();
  });

  it('should render children', () => {
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    expect(screen.getByTestId('test-component')).toBeTruthy();
  });

  it('should handle user rejected request', async () => {
    (useCommerceContracts as Mock).mockReturnValue(() =>
      Promise.resolve({
        insufficientBalance: false,
        contracts: [{}],
        priceInUSDC: '10',
      }),
    );
    (useWriteContracts as Mock).mockImplementation(() => {
      return {
        status: 'error',
        writeContractsAsync: vi
          .fn()
          .mockRejectedValue(new Error('User denied connection request.')),
      };
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe(
        'Request denied.',
      );
    });
  });

  it('should handle other errors', async () => {
    (useCommerceContracts as Mock).mockReturnValue(() =>
      Promise.resolve({
        insufficientBalance: false,
        contracts: [{}],
        priceInUSDC: '10',
      }),
    );
    (useWriteContracts as Mock).mockImplementation(() => {
      return {
        status: 'error',
        writeContractsAsync: vi
          .fn()
          .mockRejectedValue(new Error('some other error')),
      };
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe(
        GENERIC_ERROR_MESSAGE,
      );
    });
  });

  it('should handle insufficient balance', async () => {
    (useCommerceContracts as Mock).mockReturnValue(() =>
      Promise.resolve({ insufficientBalance: true, priceInUSDC: '10' }),
    );
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe(
        'You need at least 10 USDC to continue with payment',
      );
    });
  });

  it('should handle successful transaction', async () => {
    (useWaitForTransactionReceipt as Mock).mockReturnValue({
      data: { status: 'success' },
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('lifecycle-status').textContent).toBe(
        'success',
      );
    });
  });

  it('should handle connection request', async () => {
    (useAccount as Mock).mockReturnValue({
      address: undefined,
      chainId: undefined,
      isConnected: false,
    });
    (useConnect as Mock).mockReturnValue({
      connectAsync: vi
        .fn()
        .mockResolvedValue({ accounts: ['0x123'], chainId: 1 }),
      connectors: [{ id: 'coinbaseWalletSDK' }],
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(useConnect().connectAsync).toHaveBeenCalled();
    });
  });

  it('should default to coinbase wallet in connection request', async () => {
    (useAccount as Mock).mockReturnValue({
      address: undefined,
      chainId: undefined,
      isConnected: false,
    });
    (useConnect as Mock).mockReturnValue({
      connectAsync: vi
        .fn()
        .mockResolvedValue({ accounts: ['0x123'], chainId: 1 }),
      connectors: [{ id: 'not-coinbase' }],
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(useConnect().connectAsync).toHaveBeenCalled();
    });
  });

  it('should call the provided onStatus', async () => {
    const onStatus = vi.fn();
    (useWaitForTransactionReceipt as Mock).mockReturnValue({
      data: { status: 'success' },
    });
    render(
      <PayProvider onStatus={onStatus}>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(onStatus).toHaveBeenCalled();
    });
    expect(onStatus).toHaveBeenNthCalledWith(1, {
      statusName: 'init',
      statusData: {},
    });
    expect(onStatus).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ statusName: 'success' }),
    );
  });

  it('should handle chain switching', async () => {
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chainId: 1,
      isConnected: true,
    });
    (useSwitchChain as Mock).mockReturnValue({
      switchChainAsync: vi.fn().mockResolvedValue({}),
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(useSwitchChain().switchChainAsync).toHaveBeenCalledWith({
        chainId: 8453,
      }); // Base chain ID
    });
  });

  it('should update status when writeContracts is pending', async () => {
    (useWriteContracts as Mock).mockReturnValue({
      status: 'pending',
      writeContractsAsync: vi.fn(),
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('lifecycle-status').textContent).toBe(
        'paymentPending',
      );
    });
  });

  it('should handle successful transaction receipt', async () => {
    const mockReceipt = { status: 'success', transactionHash: '0x123' };
    (useWaitForTransactionReceipt as Mock).mockReturnValue({
      data: mockReceipt,
    });
    (useCallsStatus as Mock).mockReturnValue({
      data: { receipts: [{ transactionHash: '0x123' }] },
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('lifecycle-status').textContent).toBe(
        'success',
      );
    });
  });

  it('should open receipt URL on success', async () => {
    (useWaitForTransactionReceipt as Mock).mockReturnValue({
      data: { status: 'success' },
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('lifecycle-status').textContent).toBe(
        'success',
      );
    });
    fireEvent.click(screen.getByText('Submit'));
    expect(windowOpenMock).toHaveBeenCalledWith(
      expect.stringContaining('https://commerce.coinbase.com/pay/'),
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('should open funding flow for insufficient balance', async () => {
    (useCommerceContracts as Mock).mockReturnValue(() =>
      Promise.resolve({ insufficientBalance: true, priceInUSDC: '10' }),
    );
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe(
        'You need at least 10 USDC to continue with payment',
      );
    });
    fireEvent.click(screen.getByText('Submit'));
    expect(windowOpenMock).toHaveBeenCalledWith(
      'https://keys.coinbase.com/fund',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('should handle errors when fetching contracts', async () => {
    (useCommerceContracts as Mock).mockReturnValue(() =>
      Promise.resolve({ error: new Error('Failed to fetch contracts') }),
    );
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe(
        GENERIC_ERROR_MESSAGE,
      );
      expect(screen.getByTestId('lifecycle-status').textContent).toBe('error');
    });
  });

  it('should handle no contracts error', async () => {
    (useCommerceContracts as Mock).mockReturnValue(() => {
      return Promise.resolve({
        insufficientBalance: false,
        contracts: undefined,
        priceInUSDC: '10',
      });
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe(
        GENERIC_ERROR_MESSAGE,
      );
      expect(screen.getByTestId('lifecycle-status').textContent).toBe('error');
    });
  });

  it('should handle successful contract calls', async () => {
    const mockWriteContractsAsync = vi.fn().mockResolvedValue({});
    (useCommerceContracts as Mock).mockReturnValue(() => {
      return Promise.resolve({
        insufficientBalance: false,
        contracts: [{ id: 'test-contract' }],
        priceInUSDC: '10',
      });
    });
    (useWriteContracts as Mock).mockReturnValue({
      status: 'success',
      writeContractsAsync: mockWriteContractsAsync,
    });
    render(
      <PayProvider>
        <TestComponent />
      </PayProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(mockWriteContractsAsync).toHaveBeenCalled();
    });
    expect(mockWriteContractsAsync).toHaveBeenCalledWith({
      contracts: [
        {
          id: 'test-contract',
        },
      ],
    });
  });
});

describe('usePayContext', () => {
  it('should throw an error when used outside of PayProvider', () => {
    const TestComponent = () => {
      usePayContext();
      return null;
    };
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {}); // Suppress error logging
    expect(() => render(<TestComponent />)).toThrow(
      'usePayContext must be used within a Pay component',
    );
    consoleError.mockRestore();
  });
});
