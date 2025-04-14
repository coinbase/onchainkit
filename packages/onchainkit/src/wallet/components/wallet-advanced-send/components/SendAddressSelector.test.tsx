import { Address, Avatar, Name } from '@/identity';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Chain } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletContext } from '../../WalletProvider';
import { SendAddressSelector } from './SendAddressSelector';
import { useSendContext } from './SendProvider';

vi.mock('@/identity', () => ({
  Address: vi.fn(() => <div data-testid="mock-address">Address Component</div>),
  Avatar: vi.fn(() => <div data-testid="mock-avatar">Avatar Component</div>),
  Name: vi.fn(() => <div data-testid="mock-name">Name Component</div>),
}));

vi.mock('../../WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('./SendProvider', () => ({
  useSendContext: vi.fn(),
}));

const mockChain = {
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
} as Chain;

const mockWalletContext = {
  chain: mockChain,
};

const mockSendContext = {
  recipientState: {
    phase: 'input',
    input: '',
    address: null,
    displayValue: null,
  },
  selectRecipient: vi.fn(),
};

describe('SendAddressSelector', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseSendContext = useSendContext as ReturnType<typeof vi.fn>;
  const mockClassNames = {
    container: 'custom-container',
    avatar: 'custom-avatar',
    name: 'custom-name',
    address: 'custom-address',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSendContext.mockReturnValue(mockSendContext);
    mockUseWalletContext.mockReturnValue(mockWalletContext);
  });

  it('returns null when recipientState.address is null', () => {
    render(<SendAddressSelector classNames={mockClassNames} />);

    const container = screen.queryByTestId('ockSendAddressSelector_container');

    expect(container).not.toBeInTheDocument();
  });

  it('returns null when senderChain is not provided', () => {
    mockUseWalletContext.mockReturnValue({
      ...mockWalletContext,
      chain: null,
    });
    render(<SendAddressSelector classNames={mockClassNames} />);

    const container = screen.queryByTestId('ockSendAddressSelector_container');

    expect(container).not.toBeInTheDocument();
  });

  it('renders with correct structure and classes', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      recipientState: {
        ...mockSendContext.recipientState,
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'test.base.eth',
      },
    });
    render(<SendAddressSelector classNames={mockClassNames} />);

    const button = screen.getByTestId('ockSendAddressSelector_button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('w-full', 'text-left');

    const container = screen.getByTestId('ockSendAddressSelector_container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('custom-container');

    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-name')).toBeInTheDocument();
    expect(screen.getByTestId('mock-address')).toBeInTheDocument();
  });

  it('passes correct props to identity components', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      recipientState: {
        ...mockSendContext.recipientState,
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'test.base.eth',
      },
    });
    render(<SendAddressSelector classNames={mockClassNames} />);

    expect(Avatar).toHaveBeenCalledWith(
      expect.objectContaining({
        address: '0x1234567890123456789012345678901234567890',
        chain: mockWalletContext.chain,
        className: 'custom-avatar',
      }),
      {},
    );

    expect(Name).toHaveBeenCalledWith(
      expect.objectContaining({
        address: '0x1234567890123456789012345678901234567890',
        chain: mockWalletContext.chain,
        className: 'custom-name',
      }),
      {},
    );

    expect(Address).toHaveBeenCalledWith(
      expect.objectContaining({
        address: '0x1234567890123456789012345678901234567890',
        hasCopyAddressOnClick: false,
        className: 'custom-address',
      }),
      {},
    );
  });

  it('calls onClick when button is clicked and recipientState.address is not null', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      recipientState: {
        ...mockSendContext.recipientState,
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'test.base.eth',
      },
    });
    render(<SendAddressSelector classNames={mockClassNames} />);

    const button = screen.getByTestId('ockSendAddressSelector_button');
    fireEvent.click(button);

    expect(mockSendContext.selectRecipient).toHaveBeenCalledTimes(1);
  });
});
