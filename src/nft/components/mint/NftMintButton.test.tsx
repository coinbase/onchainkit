import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  http,
  WagmiProvider,
  createConfig,
  useAccount,
  useChainId,
} from 'wagmi';
import { mock } from 'wagmi/connectors';
import { useNftLifecycleContext } from '../NftLifecycleProvider';
import { useNftMintContext } from '../NftMintProvider';
import { useNftContext } from '../NftProvider';
import { NftMintButton } from './NftMintButton';

vi.mock('../NftProvider');
vi.mock('../NftMintProvider');
vi.mock('../NftLifecycleProvider');
vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
    useChainId: vi.fn(),
  };
});
vi.mock('../../../internal/components/Spinner', () => ({
  Spinner: () => <div>Spinner</div>,
}));
vi.mock('../../../transaction', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('../../../transaction')>()),
    TransactionLifecycleStatus: vi.fn(),
    TransactionButton: ({ text, disabled }) => (
      <button type="button" disabled={disabled} data-testid="transactionButton">
        {text}
      </button>
    ),
    Transaction: ({ onStatus, children, calls }) => (
      <>
        <div>
          <button type="button" onClick={calls}>
            Calls
          </button>
          <button
            type="button"
            onClick={() => onStatus({ statusName: 'transactionPending' })}
          >
            TransactionPending
          </button>
          <button
            type="button"
            onClick={() =>
              onStatus({ statusName: 'transactionLegacyExecuted' })
            }
          >
            TransactionLegacyExecuted
          </button>
          <button
            type="button"
            onClick={() => onStatus({ statusName: 'success' })}
          >
            Success
          </button>
          <button
            type="button"
            onClick={() => onStatus({ statusName: 'error' })}
          >
            Error
          </button>
        </div>
        {children}
      </>
    ),
    TransactionSponsor: vi.fn(),
    TransactionStatus: vi.fn(),
    TransactionStatusAction: vi.fn(),
    TransactionStatusLabel: vi.fn(),
  };
});
vi.mock('../../../wallet', () => ({
  ConnectWallet: () => <div>ConnectWallet</div>,
}));

const queryClient = new QueryClient();

const accountConfig = createConfig({
  chains: [base],
  connectors: [
    mock({
      accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

const TestProviders = ({ children }) => {
  return (
    <WagmiProvider config={accountConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

describe('NftMintButton', () => {
  let mockUpdateLifecycleStatus: Mock;
  beforeEach(() => {
    (useNftContext as Mock).mockReturnValue({
      contractAddress: '0x123',
      tokenId: '1',
    });
    (useNftMintContext as Mock).mockReturnValue({
      quantity: 1,
      network: 'testnet',
      isEligibleToMint: true,
      callData: {
        to: '0x123',
        data: '0x456',
        value: '0',
      },
    });
    mockUpdateLifecycleStatus = vi.fn();
    (useNftLifecycleContext as Mock).mockReturnValue({
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });
    (useAccount as Mock).mockReturnValue({ address: '0xabc' });
    (useChainId as Mock).mockReturnValue(1);
  });

  it('should render the mint button with default label', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    expect(getByText('Mint')).toBeInTheDocument();
  });

  it('should render the mint button with custom label', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton label="Custom Mint" />
      </TestProviders>,
    );
    expect(getByText('Custom Mint')).toBeInTheDocument();
  });

  it('should call updateLifecycleStatus with transactionPending status when transactionStatus is transactionPending', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );

    getByText('TransactionPending').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionPending',
    });
  });

  it('should call updateLifecycleStatus with transaction status when transactionStatus is transactionLegacyExecuted', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );

    getByText('TransactionLegacyExecuted').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionLegacyExecuted',
    });
  });

  it('should call updateLifecycleStatus with transaction status when transactionStatus is success', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );

    getByText('Success').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'success',
    });
  });

  it('should call updateLifecycleStatus with transaction status when transactionStatus is error', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );

    getByText('Error').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
    });
  });

  it('should render ConnectWallet when address is not available', () => {
    (useAccount as Mock).mockReturnValue({ address: null });
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    expect(getByText('ConnectWallet')).toBeInTheDocument();
  });

  it('should show mint ended when isEligibleToMint is false', () => {
    (useNftMintContext as Mock).mockReturnValueOnce({
      isEligibleToMint: false,
    });
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    expect(getByText('Mint ended')).toBeInTheDocument();
  });

  it('calls buildMintTransaction when button is clicked', async () => {
    const buildMintTransactionMock = vi.fn().mockResolvedValue([]);
    (useNftMintContext as Mock).mockReturnValueOnce({
      isEligibleToMint: true,
      buildMintTransaction: buildMintTransactionMock,
      quantity: 1,
    });

    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    fireEvent.click(getByText('Calls'));

    expect(buildMintTransactionMock).toHaveBeenCalledWith({
      contractAddress: '0x123',
      tokenId: '1',
      takerAddress: '0xabc',
      quantity: 1,
    });
  });
});
