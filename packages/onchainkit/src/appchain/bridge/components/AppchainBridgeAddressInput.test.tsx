import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { AppchainBridgeAddressInput } from './AppchainBridgeAddressInput';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

vi.mock('./AppchainBridgeProvider', () => ({
  useAppchainBridgeContext: vi.fn(),
}));

vi.mock('@/identity', () => ({
  Avatar: () => <div data-testid="mock-avatar">Avatar</div>,
  Address: ({ address }: { address: string }) => (
    <div data-testid="mock-address">{address}</div>
  ),
}));

describe('AppchainBridgeAddressInput', () => {
  const mockSetIsAddressModalOpen = vi.fn();
  const mockHandleAddressSelect = vi.fn();

  beforeEach(() => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      setIsAddressModalOpen: mockSetIsAddressModalOpen,
      handleAddressSelect: mockHandleAddressSelect,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with initial state', () => {
    render(<AppchainBridgeAddressInput />);

    expect(screen.getByText('Send to')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('handles back button click', () => {
    render(<AppchainBridgeAddressInput />);

    const backButton = screen.getByLabelText('Back button');
    fireEvent.click(backButton);

    expect(mockSetIsAddressModalOpen).toHaveBeenCalledWith(false);
  });

  it('shows error message for invalid address', async () => {
    render(<AppchainBridgeAddressInput />);

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'invalid-address' } });
    });

    expect(
      screen.getByText('Please enter a valid Ethereum address'),
    ).toBeInTheDocument();
  });

  it('shows address details for valid address', async () => {
    render(<AppchainBridgeAddressInput />);

    const validAddress = '0x1234567890123456789012345678901234567890';
    const input = screen.getByRole('textbox');

    await act(async () => {
      fireEvent.change(input, { target: { value: validAddress } });
    });

    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-address')).toHaveLength(2);
  });

  it('handles address selection for valid address', async () => {
    render(<AppchainBridgeAddressInput />);
    const validAddress = '0x1234567890123456789012345678901234567890';
    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: validAddress } });
    });
    const addressButton = screen.getByRole('button', {
      name: new RegExp(validAddress),
    });
    fireEvent.click(addressButton);
    expect(mockHandleAddressSelect).toHaveBeenCalledWith(validAddress);
    expect(mockSetIsAddressModalOpen).toHaveBeenCalledWith(false);
  });

  it('does not show address details or selection button for empty input', async () => {
    render(<AppchainBridgeAddressInput />);
    expect(screen.queryByTestId('mock-avatar')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /0x/i }),
    ).not.toBeInTheDocument();
  });
});
