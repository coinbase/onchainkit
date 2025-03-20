import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type Config,
  type UseAccountReturnType,
  useAccount,
  useSwitchChain,
} from 'wagmi';
import type { Token } from '../../token';
import type { SwapDefaultReact } from '../types';
import { SwapDefault } from './SwapDefault';
import { useSwapContext } from './SwapProvider';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/internal/hooks/useBreakpoints', () => ({
  useBreakpoints: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useConfig: vi.fn(),
}));

const mockSwitchChain = vi.fn();
vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
    useChainId: vi.fn(),
    useSwitchChain: vi.fn(),
  };
});

vi.mock('./SwapProvider', () => ({
  SwapProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-SwapProvider">{children}</div>
  ),
  useSwapContext: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('SwapDefault Component', () => {
  const mockConfig = { maxSlippage: 0.5 };
  const mockFrom = [{ symbol: 'ETH' }];
  const mockTo = [{ symbol: 'USDC' }];
  const mockOnError = vi.fn();
  const mockOnStatus = vi.fn();
  const mockOnSuccess = vi.fn();

  const defaultProps: SwapDefaultReact = {
    config: mockConfig,
    className: 'custom-class',
    disabled: false,
    experimental: { useAggregator: false },
    from: mockFrom as Token[],
    isSponsored: true,
    onError: mockOnError,
    onStatus: mockOnStatus,
    onSuccess: mockOnSuccess,
    title: 'Custom Swap Title',
    to: mockTo as Token[],
  };

  beforeEach(() => {
    vi.mocked(useAccount).mockReturnValue({
      address: '',
      status: 'disconnected',
    } as unknown as UseAccountReturnType<Config>);
    (useSwitchChain as ReturnType<typeof vi.fn>).mockReturnValue({
      switchChainAsync: mockSwitchChain,
    });
    (useSwapContext as Mock).mockReturnValue({
      address: '0x123',
      to: {
        setToken: vi.fn(),
        loading: false,
        amount: 1,
        token: { name: 'ETH', address: '123' },
      },
      from: {
        setToken: vi.fn(),
        loading: false,
        amount: 1,
        token: { name: 'BTC', address: '456' },
      },
      lifecycleStatus: {
        statusName: 'init',
        statusData: { missingRequiredFields: false },
      },
    });
  });

  it('renders the Swap component with provided props', () => {
    render(<SwapDefault {...defaultProps} />);

    expect(screen.getByText('Custom Swap Title')).toBeInTheDocument();

    expect(screen.getByText('Sell')).toBeInTheDocument();
    expect(screen.getByText('Buy')).toBeInTheDocument();

    expect(screen.getByTestId('ockSwapButton_Button')).toBeInTheDocument();
  });

  it('disables the SwapButton when disabled prop is true', () => {
    render(<SwapDefault {...defaultProps} disabled={true} />);

    const button = screen.getByTestId('ockSwapButton_Button');
    expect(button).toBeDisabled();
  });
});
