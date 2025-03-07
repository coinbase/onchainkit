import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Swap } from './Swap';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    useAccount: vi.fn().mockReturnValue({
      address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      chainId: 1,
    }),
    useConfig: vi.fn(),
    useSwitchChain: vi.fn(),
    useWriteContract: vi.fn(),
  };
});

vi.mock('@/internal/hooks/useBreakpoints', () => ({
  useBreakpoints: vi.fn().mockReturnValue('md'),
}));

vi.mock('./SwapProvider', () => ({
  SwapProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-SwapProvider">{children}</div>
  ),
  useSwapContext: vi.fn().mockReturnValue({
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    config: {
      maxSlippage: 10,
    },
    from: {
      amount: '100',
    },
    to: {
      amount: '100',
    },
    lifecycleStatus: {
      statusName: 'init',
      statusData: {
        isMissingRequiredField: true,
        maxSlippage: 10,
      },
    },
    handleAmountChange: vi.fn(),
    handleSubmit: vi.fn(),
    handleToggle: vi.fn(),
    updateLifecycleStatus: vi.fn(),
    isToastVisible: false,
  }),
}));

vi.mock('@/internal/svg/closeSvg', () => ({
  CloseSvg: () => <div data-testid="mock-close-svg" />,
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/styles/theme', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../styles/theme')>();
  return {
    ...actual,
    background: { default: 'bg-default' },
    border: { radius: 'border-radius' },
    color: { foreground: 'text-foreground' },
    text: { title3: 'text-title3' },
    cn: (...args: string[]) => args.filter(Boolean).join(' '),
    icon: {
      foreground: 'icon-foreground-class',
    },
  };
});

describe('Swap Component', () => {
  it('should render the title correctly', () => {
    render(<Swap title="Test Swap">Test Swap</Swap>);

    const title = screen.getByTestId('ockSwap_Title');
    expect(title).toHaveTextContent('Test Swap');
  });

  it('should pass className to container div', () => {
    render(<Swap className="custom-class">Test Swap</Swap>);

    const container = screen.getByTestId('ockSwap_Container');
    expect(container).toHaveClass('custom-class');
  });

  it('should render children', () => {
    render(
      <Swap>
        <div>Test Child</div>
      </Swap>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should render children when to, from, and disabled are provided', () => {
    const toToken = {
      address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      chainId: 1,
      decimals: 18,
      image: 'https://example.com/image.png',
      name: 'toToken',
      symbol: 'toToken',
    };
    const fromToken = {
      address: '0x0000000000000000000000000000000000000001' as `0x${string}`,
      chainId: 1,
      decimals: 18,
      image: 'https://example.com/image.png',
      name: 'fromToken',
      symbol: 'fromToken',
    };
    render(<Swap to={[toToken]} from={[fromToken]} disabled={true} />);

    expect(screen.getByText('Buy')).toBeInTheDocument();
    expect(screen.getByText('Sell')).toBeInTheDocument();
  });
});
