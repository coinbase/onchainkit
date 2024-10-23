import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { getSlicedAddress } from '../utils/getSlicedAddress';
import { Address } from './Address';
import { useIdentityContext } from './IdentityProvider';

function mock<T>(func: T) {
  return func as Mock;
}

vi.mock('../utils/getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
}));

vi.mock('./IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

const useIdentityContextMock = mock(useIdentityContext);

const mockGetSlicedAddress = (addr: string) =>
  `${addr.slice(0, 5)}...${addr.slice(-4)}`;

describe('Address component', () => {
  const testIdentityProviderAddress = '0xIdentityAddress';
  const testAddressComponentAddress =
    '0x1234567890abcdef1234567890abcdef12345678';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should console.error and return null when no address is provided', () => {
    vi.mocked(useIdentityContext).mockReturnValue({});
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { container } = render(<Address />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Address: an Ethereum address must be provided to the Identity or Address component.',
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the sliced address when address supplied to Identity', () => {
    useIdentityContextMock.mockReturnValue({
      address: testAddressComponentAddress,
    });
    (getSlicedAddress as Mock).mockReturnValue(
      mockGetSlicedAddress(testAddressComponentAddress),
    );

    const { getByText } = render(<Address />);
    expect(
      getByText(mockGetSlicedAddress(testAddressComponentAddress)),
    ).toBeInTheDocument();
  });

  it('renders the sliced address when address supplied to Identity', () => {
    useIdentityContextMock.mockReturnValue({});
    (getSlicedAddress as Mock).mockReturnValue(
      mockGetSlicedAddress(testAddressComponentAddress),
    );

    const { getByText } = render(
      <Address address={testAddressComponentAddress} />,
    );
    expect(
      getByText(mockGetSlicedAddress(testAddressComponentAddress)),
    ).toBeInTheDocument();
  });

  it('displays sliced address when ENS name is not available and isSliced is set to true', () => {
    useIdentityContextMock.mockReturnValue({});
    (getSlicedAddress as Mock).mockReturnValue(
      mockGetSlicedAddress(testAddressComponentAddress),
    );

    render(<Address address={testAddressComponentAddress} isSliced={true} />);
    expect(
      screen.getByText(mockGetSlicedAddress(testAddressComponentAddress)),
    ).toBeInTheDocument();
    expect(getSlicedAddress).toHaveBeenCalledWith(testAddressComponentAddress);
  });

  it('displays full address when isSliced is false and ENS name is not available', () => {
    useIdentityContextMock.mockReturnValue({});
    render(<Address address={testAddressComponentAddress} isSliced={false} />);
    expect(screen.getByText(testAddressComponentAddress)).toBeInTheDocument();
    expect(getSlicedAddress).not.toHaveBeenCalled();
  });

  it('use identity context address if provided', () => {
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });
    render(<Address isSliced={false} />);
    expect(screen.getByText(testIdentityProviderAddress)).toBeInTheDocument();
    expect(getSlicedAddress).not.toHaveBeenCalled();
  });

  it('use component address over identity context if both are provided', () => {
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });
    render(<Address address={testAddressComponentAddress} isSliced={false} />);
    expect(screen.getByText(testAddressComponentAddress)).toBeInTheDocument();
    expect(getSlicedAddress).not.toHaveBeenCalled();
  });

  it('copies the address to clipboard when clicked', async () => {
    const user = userEvent.setup();
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(
      mockWriteText,
    );

    useIdentityContextMock.mockReturnValue({});
    render(<Address address={testAddressComponentAddress} />);

    const addressElement = screen.getByTestId('ockAddress');
    await user.click(addressElement);

    expect(mockWriteText).toHaveBeenCalledWith(testAddressComponentAddress);
  });

  it('shows "Copied" text after clicking', async () => {
    const user = userEvent.setup();
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(
      mockWriteText,
    );

    useIdentityContextMock.mockReturnValue({});
    render(<Address address={testAddressComponentAddress} />);

    const addressElement = screen.getByTestId('ockAddress');
    await user.click(addressElement);
    expect(screen.getByText('Copied')).toBeInTheDocument();
    expect(mockWriteText).toHaveBeenCalledWith(testAddressComponentAddress);
  });

  it('handles clipboard write error', async () => {
    const user = userEvent.setup();
    const mockWriteText = vi
      .fn()
      .mockRejectedValue(new Error('Clipboard error'));
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(
      mockWriteText,
    );

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    useIdentityContextMock.mockReturnValue({});
    render(<Address address={testAddressComponentAddress} />);

    const addressElement = screen.getByTestId('ockAddress');
    await user.click(addressElement);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to copy address: ',
      expect.any(Error),
    );
    expect(screen.getByText('Copy')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('applies custom className when provided', () => {
    useIdentityContextMock.mockReturnValue({});
    render(
      <Address
        address={testAddressComponentAddress}
        className="custom-class"
      />,
    );

    const addressElement = screen.getByTestId('ockAddress');
    expect(addressElement).toHaveClass('custom-class');
  });
});
