import { Address, Avatar, Name } from '@/identity';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address as AddressType, Chain } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendAddressSelector } from './SendAddressSelector';

vi.mock('@/identity', () => ({
  Address: vi.fn(() => <div data-testid="mock-address">Address Component</div>),
  Avatar: vi.fn(() => <div data-testid="mock-avatar">Avatar Component</div>),
  Name: vi.fn(() => <div data-testid="mock-name">Name Component</div>),
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

describe('SendAddressSelector', () => {
  const mockProps = {
    address: '0x1234567890123456789012345678901234567890' as AddressType,
    senderChain: mockChain,
    onClick: vi.fn(),
    classNames: {
      container: 'custom-container',
      avatar: 'custom-avatar',
      name: 'custom-name',
      address: 'custom-address',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when address is not provided', () => {
    render(<SendAddressSelector {...mockProps} address={null} />);

    const container = screen.queryByTestId('ockSendAddressSelector_container');

    expect(container).not.toBeInTheDocument();
  });

  it('returns null when senderChain is not provided', () => {
    render(<SendAddressSelector {...mockProps} senderChain={undefined} />);

    const container = screen.queryByTestId('ockSendAddressSelector_container');

    expect(container).not.toBeInTheDocument();
  });

  it('renders with correct structure and classes', () => {
    render(<SendAddressSelector {...mockProps} />);

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
    render(<SendAddressSelector {...mockProps} />);

    expect(Avatar).toHaveBeenCalledWith(
      expect.objectContaining({
        address: mockProps.address,
        chain: mockProps.senderChain,
        className: 'custom-avatar',
      }),
      {},
    );

    expect(Name).toHaveBeenCalledWith(
      expect.objectContaining({
        address: mockProps.address,
        chain: mockProps.senderChain,
        className: 'custom-name',
      }),
      {},
    );

    expect(Address).toHaveBeenCalledWith(
      expect.objectContaining({
        address: mockProps.address,
        hasCopyAddressOnClick: false,
        className: 'custom-address',
      }),
      {},
    );
  });

  it('calls onClick when button is clicked', () => {
    render(<SendAddressSelector {...mockProps} />);

    const button = screen.getByTestId('ockSendAddressSelector_button');
    fireEvent.click(button);

    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });
});
