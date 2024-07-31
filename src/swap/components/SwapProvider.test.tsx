import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, fireEvent, screen } from '@testing-library/react';
import { SwapProvider, useSwapContext } from './SwapProvider';
import { getSwapQuote } from '../utils/getSwapQuote';
import type { Token } from '../../token';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import { SwapError } from '../types';
import { TransactionReceipt } from 'viem';
import { buildSwapTransaction } from '../utils/buildSwapTransaction';

vi.mock('../utils/getSwapQuote', () => ({
  getSwapQuote: vi.fn(),
}));

vi.mock('../utils/buildSwapTransaction', () => ({
  buildSwapTransaction: vi.fn(),
}));

vi.mock('../utils/processSwapTransaction', () => ({
  processSwapTransaction: vi.fn(),
}));

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [base],
  connectors: [
    mock({
      accounts: [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      ],
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

const ETH: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};
const DEGEN: Token = {
  name: 'DEGEN',
  address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
  symbol: 'DEGEN',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
  chainId: 8453,
};

const renderWithProviders = (Component: React.ComponentType) => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockExperimental = { useAggregator: true, maxSlippage: 10 };

  return render(
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SwapProvider address={mockAddress} experimental={mockExperimental}>
          <Component />
        </SwapProvider>
      </QueryClientProvider>
    </WagmiProvider>,
  );
};

describe('useSwapContext', () => {
  it('should throw an error when used outside of SwapProvider', () => {
    const TestComponent = () => {
      useSwapContext();
      return null;
    };

    // Suppress console.error for this test to avoid noisy output
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSwapContext must be used within a Swap component');

    // Restore console.error
    console.error = originalError;
  });

  it('should provide context when used within SwapProvider', async () => {
    const TestComponent = () => {
      const context = useSwapContext();
      expect(context).toBeDefined();
      expect(context.from).toBeDefined();
      expect(context.to).toBeDefined();
      expect(context.handleAmountChange).toBeDefined();
      return null;
    };

    await act(async () => {
      renderWithProviders(TestComponent);
    });
  });
});

describe('SwapProvider', () => {
  it('should handle submit correctly', async () => {
    const mockOnError = vi.fn();
    const mockOnSuccess = vi.fn();
    let submitFunction: (
      onError?: (error: SwapError) => void,
      onSuccess?: (txReceipt: TransactionReceipt) => void | Promise<void>,
    ) => void;

    const TestComponent = () => {
      const { from, to, handleSubmit } = useSwapContext();
      submitFunction = handleSubmit;

      React.useEffect(() => {
        from.setToken(ETH);
        from.setAmount('100');
        to.setToken(DEGEN);
      }, []);

      return (
        <button onClick={() => handleSubmit(mockOnError, mockOnSuccess)}>
          Submit Swap
        </button>
      );
    };

    await act(async () => {
      renderWithProviders(TestComponent);
    });

    // Trigger the submit
    await act(async () => {
      fireEvent.click(screen.getByText('Submit Swap'));
    });

    expect(buildSwapTransaction).toBeCalledTimes(1);
  });

  it('should pass the correct slippage to getSwapQuote', async () => {
    const TestComponent = () => {
      const { from, to, handleAmountChange } = useSwapContext();

      // Trigger handleAmountChange when the component mounts
      React.useEffect(() => {
        const initializeSwap = () => {
          from.setToken(ETH);
          to.setToken(DEGEN);
          handleAmountChange('from', '100', ETH, DEGEN);
        };
        initializeSwap();
      }, []);

      return null;
    };

    await act(async () => {
      renderWithProviders(TestComponent);
    });

    // Assert that getSwapQuote was called with the correct parameters
    expect(getSwapQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        maxSlippage: '10',
        amount: '100',
        amountReference: 'from',
        from: ETH,
        to: DEGEN,
        useAggregator: true,
      }),
    );
  });

  beforeEach(async () => {
    vi.resetAllMocks();
    await act(async () => {
      renderWithProviders(() => null);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
