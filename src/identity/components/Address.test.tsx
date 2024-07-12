/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Address } from './Address';
import { useIdentityContext } from './IdentityProvider';
import { getSlicedAddress } from '../getSlicedAddress';

function mock<T>(func: T) {
  return func as vi.Mock;
}

const silenceError = () => {
  const consoleErrorMock = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  return () => consoleErrorMock.mockRestore();
};

vi.mock('./IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

vi.mock('../getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
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

  it('should throw an error when no address is provided', () => {
    const restore = silenceError();
    useIdentityContextMock.mockReturnValue({});
    expect(() => {
      render(<Address />);
    }).toThrow(
      'Address: an Ethereum address must be provided to the Identity or Address component.',
    );
    restore();
  });

  it('renders the sliced address when address supplied to Identity', () => {
    useIdentityContextMock.mockReturnValue({
      address: testAddressComponentAddress,
    });
    (getSlicedAddress as vi.Mock).mockReturnValue(
      mockGetSlicedAddress(testAddressComponentAddress),
    );

    const { getByText } = render(<Address />);
    expect(
      getByText(mockGetSlicedAddress(testAddressComponentAddress)),
    ).toBeInTheDocument();
  });

  it('renders the sliced address when address supplied to Identity', () => {
    useIdentityContextMock.mockReturnValue({});
    (getSlicedAddress as vi.Mock).mockReturnValue(
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
    (getSlicedAddress as vi.Mock).mockReturnValue(
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
});
