import { Skeleton } from '@/internal/components/Skeleton';
import { render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ETH_REQUIRED_FOR_SEND } from '../constants';
import type { SendContextType } from '../types';
import { Send } from './Send';
import { SendAddressSelection } from './SendAddressSelection';
import { SendAmountInput } from './SendAmountInput';
import { SendButton } from './SendButton';
import { SendFundWallet } from './SendFundWallet';
import { SendHeader } from './SendHeader';
import { SendProvider, useSendContext } from './SendProvider';
import { SendTokenSelector } from './SendTokenSelector';

// Mock all dependencies
vi.mock('@/internal/components/Skeleton');
vi.mock('@/internal/hooks/useTheme');
vi.mock('./SendAddressSelection');
vi.mock('./SendAmountInput');
vi.mock('./SendButton');
vi.mock('./SendFundWallet');
vi.mock('./SendHeader');
vi.mock('./SendProvider', () => ({
  SendProvider: vi.fn(({ children }) => (
    <div data-testid="mock-send-provider">{children}</div>
  )),
  useSendContext: vi.fn(),
}));
vi.mock('./SendTokenSelector');

const mockSelectedtoken = {
  name: 'USD Coin',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address,
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjMZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
  cryptoBalance: 69,
  fiatBalance: 69,
};

describe('Send', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with SendProvider and applies correct classes', () => {
    vi.mocked(useSendContext).mockReturnValue({
      isInitialized: false,
      ethBalance: 0,
      selectedRecipient: { address: null, displayValue: '' },
      selectedToken: null,
    } as SendContextType);

    render(<Send />);

    expect(SendProvider).toHaveBeenCalled();
    const sendContainer = screen.getByTestId('ockSend');
    expect(sendContainer).toHaveClass('h-120 w-88 flex flex-col p-4');
  });

  it('applies custom className when provided', () => {
    vi.mocked(useSendContext).mockReturnValue({
      isInitialized: false,
      ethBalance: 0,
      selectedRecipient: { address: null, displayValue: '' },
      selectedToken: null,
    } as SendContextType);

    render(<Send className="custom-class" />);

    const sendContainer = screen.getByTestId('ockSend');
    expect(sendContainer).toHaveClass('custom-class');
  });

  it('renders custom children when provided', () => {
    const customChildren = (
      <div data-testid="custom-children">Custom Content</div>
    );
    render(<Send>{customChildren}</Send>);

    expect(screen.getByTestId('custom-children')).toBeInTheDocument();
  });

  describe('SendDefaultChildren', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('renders skeleton when not initialized', () => {
      vi.mocked(useSendContext).mockReturnValue({
        isInitialized: false,
        ethBalance: undefined,
        selectedRecipient: { address: null, displayValue: '' },
        selectedToken: null,
      } as SendContextType);

      render(<Send />);

      expect(Skeleton).toHaveBeenCalledWith(
        expect.objectContaining({ className: 'h-full w-full' }),
        {},
      );
    });

    it('renders SendFundWallet when wallet has insufficient ETH', () => {
      vi.mocked(useSendContext).mockReturnValue({
        isInitialized: true,
        ethBalance: 0,
      } as SendContextType);

      render(<Send />);

      expect(SendHeader).toHaveBeenCalled();
      expect(SendFundWallet).toHaveBeenCalled();
      expect(SendAddressSelection).not.toHaveBeenCalled();
    });

    it('renders SendAddressSelection when wallet has sufficient ETH', () => {
      vi.mocked(useSendContext).mockReturnValue({
        isInitialized: true,
        ethBalance: ETH_REQUIRED_FOR_SEND + 0.0000000001, // de-minimis amount above ETH_REQUIRED_FOR_SEND
        selectedRecipient: { address: null, displayValue: '' },
        selectedToken: null,
      } as SendContextType);

      render(<Send />);

      expect(SendHeader).toHaveBeenCalled();
      expect(SendAddressSelection).toHaveBeenCalled();
      expect(SendFundWallet).not.toHaveBeenCalled();
      expect(SendTokenSelector).not.toHaveBeenCalled();
    });

    it('renders SendTokenSelector when recipient address is selected but token is not', () => {
      vi.mocked(useSendContext).mockReturnValue({
        isInitialized: true,
        ethBalance: ETH_REQUIRED_FOR_SEND + 0.0000000001, // de-minimis amount above ETH_REQUIRED_FOR_SEND
        selectedRecipient: {
          address: '0x1234567890123456789012345678901234567890' as Address,
          displayValue: '0x1234567890123456789012345678901234567890',
        },
        selectedToken: null,
      } as SendContextType);

      render(<Send />);

      expect(SendHeader).toHaveBeenCalled();
      expect(SendAddressSelection).toHaveBeenCalled();
      expect(SendTokenSelector).toHaveBeenCalled();
      expect(SendAmountInput).not.toHaveBeenCalled();
    });

    it('renders SendAmountInput and SendButton when both recipient and token are selected', () => {
      vi.mocked(useSendContext).mockReturnValue({
        isInitialized: true,
        ethBalance: ETH_REQUIRED_FOR_SEND + 0.0000001,
        selectedRecipient: {
          address: '0x1234567890123456789012345678901234567890' as Address,
          displayValue: '0x1234567890123456789012345678901234567890',
        },
        selectedToken: mockSelectedtoken,
      } as SendContextType);

      render(<Send />);

      expect(SendHeader).toHaveBeenCalled();
      expect(SendAddressSelection).toHaveBeenCalled();
      expect(SendAmountInput).toHaveBeenCalled();
      expect(SendTokenSelector).toHaveBeenCalled();
      expect(SendButton).toHaveBeenCalled();
    });
  });
});
