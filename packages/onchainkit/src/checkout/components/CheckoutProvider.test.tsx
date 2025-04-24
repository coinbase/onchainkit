import { openPopup } from '@/internal/utils/openPopup';
import { useOnchainKit } from '@/useOnchainKit';
import { useIsWalletACoinbaseSmartWallet } from '@/wallet/hooks/useIsWalletACoinbaseSmartWallet';
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
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { CheckoutEvent } from '../../core/analytics/types';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import { useCommerceContracts } from '../hooks/useCommerceContracts';
import { CheckoutProvider, useCheckoutContext } from './CheckoutProvider';

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

vi.mock('../../wallet/hooks/useIsWalletACoinbaseSmartWallet', () => ({
  useIsWalletACoinbaseSmartWallet: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('@/internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('../../core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    sendAnalytics: vi.fn(),
  })),
}));

const windowOpenMock = vi.fn();

const TestComponent = () => {
  const context = useCheckoutContext();
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
      <button type="submit" onClick={context.onSubmit}>
        Submit
      </button>
    </div>
  );
};

describe('CheckoutProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(window, 'open').mockImplementation(windowOpenMock);
    (useOnchainKit as Mock).mockReturnValue({
      config: { paymaster: null },
    });
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
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(true);
  });

  afterEach(() => {
    windowOpenMock.mockReset();
  });

  it('should render children', () => {
    render(
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe(
        'Request denied.',
      );
    });
  });

  it('should clear user rejected request on next button press', async () => {
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe(
        'Request denied.',
      );
    });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe('');
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe(
        GENERIC_ERROR_MESSAGE,
      );
    });
  });

  it('should handle successful transaction', async () => {
    (useWaitForTransactionReceipt as Mock).mockReturnValue({
      data: { status: 'success' },
    });
    render(
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(useConnect().connectAsync).toHaveBeenCalled();
    });
  });

  it('should default to coinbase wallet in connection request if not connected', async () => {
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(useConnect().connectAsync).toHaveBeenCalled();
    });
  });

  it('should default to coinbase wallet in connection request if not smart wallet', async () => {
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);
    render(
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(useConnect().connectAsync).toHaveBeenCalled();
    });
  });

  it('should call the provided onStatus', async () => {
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
    const onStatus = vi.fn();
    (useWaitForTransactionReceipt as Mock).mockReturnValue({
      data: { status: 'success' },
    });
    render(
      <CheckoutProvider onStatus={onStatus}>
        <TestComponent />
      </CheckoutProvider>,
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(useSwitchChain().switchChainAsync).toHaveBeenCalledWith({
        chainId: 8453,
      }); // Base chain ID
    });
  });

  it('should update status when writeContracts is pending', async () => {
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
    (useWriteContracts as Mock).mockReturnValue({
      status: 'pending',
      writeContractsAsync: vi.fn(),
    });
    render(
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('lifecycle-status').textContent).toBe(
        'pending',
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(openPopup as Mock).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://keys.coinbase.com/fund?asset=USDC&chainId=8453&presetCryptoAmount=10',
        }),
      );
    });
  });

  it('should handle errors when fetching contracts', async () => {
    (useCommerceContracts as Mock).mockReturnValue(() =>
      Promise.resolve({ error: new Error('Failed to fetch contracts') }),
    );
    render(
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
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
      <CheckoutProvider>
        <TestComponent />
      </CheckoutProvider>,
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
      capabilities: undefined,
    });
  });

  it('should handle sponsored contract calls', async () => {
    (useOnchainKit as Mock).mockReturnValue({
      config: { paymaster: 'http://example.com' },
    });
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
      <CheckoutProvider isSponsored={true}>
        <TestComponent />
      </CheckoutProvider>,
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
      capabilities: {
        paymasterService: {
          url: 'http://example.com',
        },
      },
    });
  });

  describe('analytics', () => {
    let sendAnalytics: Mock;

    beforeEach(() => {
      sendAnalytics = vi.fn();
      (useAnalytics as Mock).mockImplementation(() => ({
        sendAnalytics,
      }));
      (useCommerceContracts as Mock).mockReturnValue(() =>
        Promise.resolve({
          insufficientBalance: false,
          contracts: [{}],
          priceInUSDC: '10.00',
        }),
      );
    });

    it('should track checkout initiated', async () => {
      render(
        <CheckoutProvider productId="test-product">
          <TestComponent />
        </CheckoutProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('lifecycle-status').textContent).toBe(
          'ready',
        );
      });

      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(sendAnalytics).toHaveBeenCalledWith(
          CheckoutEvent.CheckoutInitiated,
          {
            address: '0x123',
            amount: 10,
            productId: 'test-product',
          },
        );
      });
    });

    it('should track checkout failure', async () => {
      const error = new Error('Test error');
      (useWriteContracts as Mock).mockImplementation(() => ({
        status: 'error',
        writeContractsAsync: vi.fn().mockRejectedValue(error),
      }));

      render(
        <CheckoutProvider productId="test-product">
          <TestComponent />
        </CheckoutProvider>,
      );

      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(sendAnalytics).toHaveBeenCalledWith(
          CheckoutEvent.CheckoutFailure,
          {
            error: 'Test error',
            metadata: { error: JSON.stringify(error) },
          },
        );
      });
    });

    it('should track checkout failure with unknown error', async () => {
      (useWriteContracts as Mock).mockImplementation(() => ({
        status: 'error',
        writeContractsAsync: vi.fn().mockRejectedValue('string error'),
      }));

      render(
        <CheckoutProvider productId="test-product">
          <TestComponent />
        </CheckoutProvider>,
      );

      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(sendAnalytics).toHaveBeenCalledTimes(2);
        expect(sendAnalytics).toHaveBeenNthCalledWith(
          1,
          CheckoutEvent.CheckoutInitiated,
          {
            address: '0x123',
            amount: 0,
            productId: 'test-product',
          },
        );
        expect(sendAnalytics).toHaveBeenNthCalledWith(
          2,
          CheckoutEvent.CheckoutFailure,
          {
            error: 'Checkout failed',
            metadata: { error: JSON.stringify('string error') },
          },
        );
      });
    });
  });
});

describe('useCheckoutContext', () => {
  it('should throw an error when used outside of CheckoutProvider', () => {
    const TestComponent = () => {
      useCheckoutContext();
      return null;
    };
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {}); // Suppress error logging
    expect(() => render(<TestComponent />)).toThrow(
      'useCheckoutContext must be used within a Checkout component',
    );
    consoleError.mockRestore();
  });
});
