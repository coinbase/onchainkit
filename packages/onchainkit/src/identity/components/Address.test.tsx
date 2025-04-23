import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { getSlicedAddress } from '../utils/getSlicedAddress';
import { useIdentityContext } from './IdentityProvider';

import { Address } from './Address';

function mock<T>(func: T) {
  return func as Mock;
}

vi.mock('@/identity/utils/getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
}));

vi.mock('@/identity/components/IdentityProvider', () => ({
  useIdentityContext: vi.fn(() => ({
    address: undefined,
    ensName: undefined,
    loading: false,
    error: null,
  })),
}));

const useIdentityContextMock = mock(useIdentityContext);

const mockGetSlicedAddress = (addr: string) =>
  `${addr.slice(0, 5)}...${addr.slice(-4)}`;

const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};

Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  configurable: true,
});

describe('Address component', () => {
  const testIdentityProviderAddress = '0xIdentityAddress';
  const testAddressComponentAddress =
    '0x1234567890abcdef1234567890abcdef12345678';

  beforeEach(() => {
    vi.clearAllMocks();
    mockClipboard.writeText.mockClear();
    useIdentityContextMock.mockReturnValue({
      address: undefined,
      ensName: undefined,
      loading: false,
      error: null,
    });
  });

  it('should console.error and return null when no address is provided', () => {
    useIdentityContextMock.mockReturnValue({
      address: undefined,
      ensName: undefined,
      loading: false,
      error: null,
    });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { container } = render(<Address />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Address: an Ethereum address must be provided to the Identity or Address component.',
    );
    expect(container.firstChild).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it('should render the sliced address when address supplied to Identity', () => {
    useIdentityContextMock.mockReturnValue({
      address: testAddressComponentAddress,
      ensName: undefined,
      loading: false,
      error: null,
    });
    (getSlicedAddress as Mock).mockReturnValue(
      mockGetSlicedAddress(testAddressComponentAddress),
    );

    render(<Address />);
    expect(getSlicedAddress).toHaveBeenCalledWith(testAddressComponentAddress);
    expect(
      screen.getByText(mockGetSlicedAddress(testAddressComponentAddress)),
    ).toBeInTheDocument();
  });

  it('should render the sliced address when address supplied directly to component', () => {
    useIdentityContextMock.mockReturnValue({
      address: undefined,
      ensName: undefined,
      loading: false,
      error: null,
    });
    (getSlicedAddress as Mock).mockReturnValue(
      mockGetSlicedAddress(testAddressComponentAddress),
    );

    render(<Address address={testAddressComponentAddress} />);
    expect(getSlicedAddress).toHaveBeenCalledWith(testAddressComponentAddress);
    expect(
      screen.getByText(mockGetSlicedAddress(testAddressComponentAddress)),
    ).toBeInTheDocument();
  });

  it('should display sliced address when ENS name is not available and isSliced is true', () => {
    useIdentityContextMock.mockReturnValue({
      address: undefined,
      ensName: undefined,
      loading: false,
      error: null,
    });
    (getSlicedAddress as Mock).mockReturnValue(
      mockGetSlicedAddress(testAddressComponentAddress),
    );

    render(<Address address={testAddressComponentAddress} isSliced={true} />);
    expect(getSlicedAddress).toHaveBeenCalledWith(testAddressComponentAddress);
    expect(
      screen.getByText(mockGetSlicedAddress(testAddressComponentAddress)),
    ).toBeInTheDocument();
  });

  it('should display full address when isSliced is false and ENS name is not available', () => {
    useIdentityContextMock.mockReturnValue({});
    render(<Address address={testAddressComponentAddress} isSliced={false} />);
    expect(screen.getByText(testAddressComponentAddress)).toBeInTheDocument();
    expect(getSlicedAddress).not.toHaveBeenCalled();
  });

  it('should use identity context address if provided', () => {
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });
    render(<Address isSliced={false} />);
    expect(screen.getByText(testIdentityProviderAddress)).toBeInTheDocument();
    expect(getSlicedAddress).not.toHaveBeenCalled();
  });

  it('should prioritize component address over identity context address if both are provided', () => {
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });
    render(<Address address={testAddressComponentAddress} isSliced={false} />);
    expect(screen.getByText(testAddressComponentAddress)).toBeInTheDocument();
    expect(getSlicedAddress).not.toHaveBeenCalled();
  });

  describe('clipboard functionality', () => {
    const testAddress = '0x1234567890abcdef';

    beforeEach(() => {
      vi.clearAllMocks();
      useIdentityContextMock.mockReturnValue({
        address: undefined,
        ensName: undefined,
        loading: false,
        error: null,
      });
    });

    it('should not show copy functionality when hasCopyAddressOnClick is false', () => {
      render(<Address address={testAddress} hasCopyAddressOnClick={false} />);
      const element = screen.getByTestId('ockAddress');
      expect(element.querySelector('span:last-child')).toBeNull();
    });

    it('should show copy functionality by default', async () => {
      render(<Address address={testAddress} />);
      const element = screen.getByTestId('ockAddress');
      expect(element).toHaveAttribute('role', 'button');
      expect(element.querySelector('button')).toBeInTheDocument();
    });

    it('should copy to clipboard and show tooltip when clicked', async () => {
      mockClipboard.writeText.mockResolvedValueOnce(undefined);

      render(<Address address={testAddress} />);

      const element = screen.getByTestId('ockAddress');
      await fireEvent.click(element);

      await waitFor(() => {
        const tooltip = element.querySelector('button');
        expect(tooltip?.textContent).toBe('Copied');
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith(testAddress);
    });

    it('should handle keyboard interactions', async () => {
      mockClipboard.writeText.mockResolvedValueOnce(undefined);

      render(<Address address={testAddress} />);

      const element = screen.getByTestId('ockAddress');

      await fireEvent.keyDown(element, { key: 'Enter' });

      await waitFor(() => {
        const tooltip = element.querySelector('button');
        expect(tooltip?.textContent).toBe('Copied');
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith(testAddress);
    });

    it('should handle clipboard errors gracefully', async () => {
      mockClipboard.writeText.mockRejectedValueOnce('Clipboard error');
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(<Address address={testAddress} />);

      const element = screen.getByTestId('ockAddress');

      await fireEvent.click(element);

      await waitFor(
        () => {
          expect(consoleErrorSpy).toHaveBeenCalled();
        },
        { timeout: 1000 },
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle space key press', async () => {
      mockClipboard.writeText.mockResolvedValueOnce(undefined);

      render(<Address address={testAddress} />);

      const element = screen.getByTestId('ockAddress');

      await fireEvent.keyDown(element, { key: ' ' });

      await waitFor(() => {
        const tooltip = element.querySelector('button');
        expect(tooltip?.textContent).toBe('Copied');
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith(testAddress);
    });
  });
});
