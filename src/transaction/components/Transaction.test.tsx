import { useOnchainKit } from '@/useOnchainKit';
import { render, screen } from '@testing-library/react';
import { base, baseSepolia } from 'viem/chains';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { type Config, type UseAccountReturnType, useAccount } from 'wagmi';
import { Transaction } from './Transaction';
import {
  TransactionProvider,
  useTransactionContext,
} from './TransactionProvider';

function mock<T>(func: T) {
  return func as Mock;
}

vi.mock('./TransactionProvider', () => ({
  TransactionProvider: vi.fn(
    ({ chainId, children }: { chainId: number; children: React.ReactNode }) => (
      <div>
        <div>{children}</div>
        <div>{`chainId: ${chainId}`}</div>
      </div>
    ),
  ),
  useTransactionContext: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useConfig: vi.fn(),
  useChainId: vi.fn(),
}));

const useOnchainKitMock = mock(useOnchainKit);

describe('Transaction', () => {
  beforeEach(() => {
    useOnchainKitMock.mockReturnValue({
      chain: baseSepolia,
    });
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      transactionId: undefined,
      onSubmit: vi.fn(),
      isLoading: false,
      transactions: ['transact'],
    });
    vi.mocked(useAccount).mockReturnValue({
      address: '0x123',
    } as unknown as UseAccountReturnType<Config>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the children inside the TransactionProvider', () => {
    render(
      <Transaction
        capabilities={{}}
        chainId={123}
        className="test-class"
        contracts={[]}
        onError={vi.fn()}
        onSuccess={vi.fn()}
      >
        <div>Test Child</div>
      </Transaction>,
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should apply the correct className', () => {
    render(
      <Transaction
        capabilities={{}}
        chainId={123}
        className="test-class"
        contracts={[]}
        onError={vi.fn()}
        onSuccess={vi.fn()}
      >
        <div>Test Child</div>
      </Transaction>,
    );
    // Checking if the div has the correct classes applied
    const container = screen.getByText('Test Child').parentElement;
    expect(container).toHaveClass('test-class');
  });

  it('should call TransactionProvider', () => {
    const onError = vi.fn();
    const onStatus = vi.fn();
    const onSuccess = vi.fn();
    render(
      <Transaction
        capabilities={{}}
        chainId={123}
        className="test-class"
        contracts={[]}
        onError={onError}
        onStatus={onStatus}
        onSuccess={onSuccess}
      >
        <div>Test Child</div>
      </Transaction>,
    );
    // Checking if the TransactionProvider is called
    expect(TransactionProvider).toHaveBeenCalledTimes(1);
  });

  it('should use the chainId from the context if not provided', () => {
    render(
      <Transaction
        capabilities={{}}
        className="test-class"
        contracts={[]}
        onError={vi.fn()}
        onSuccess={vi.fn()}
      >
        <div>Test Child</div>
      </Transaction>,
    );
    expect(screen.getByText(`chainId: ${baseSepolia.id}`)).toBeInTheDocument();
  });

  it('should use the provided chainId if provided', () => {
    render(
      <Transaction
        capabilities={{}}
        chainId={base.id}
        className="test-class"
        contracts={[]}
        onError={vi.fn()}
        onSuccess={vi.fn()}
      >
        <div>Test Child</div>
      </Transaction>,
    );
    expect(screen.getByText(`chainId: ${base.id}`)).toBeInTheDocument();
  });

  it('should render default children if no children provided', () => {
    render(
      <Transaction
        capabilities={{}}
        chainId={base.id}
        className="test-class"
        contracts={[]}
        onError={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );
    expect(
      screen.getByTestId('ockTransactionButton_Button'),
    ).toBeInTheDocument();
  });
});
