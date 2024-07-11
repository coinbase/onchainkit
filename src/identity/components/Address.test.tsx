/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Address } from './Address';
import { useIdentityContext } from './IdentityProvider';
import { getSlicedAddress } from '../getSlicedAddress';
import { mock, silenceError } from '../../internal/testing';

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
  const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error when no address is provided', () => {
    const restore = silenceError();
    useIdentityContextMock.mockReturnValue({});
    expect(() => {
      render(<Address />);
    }).toThrow(
      'Address: an Ethereum address must be provided to the Identity or Address component.'
    );
    restore();
  });

  it('renders the sliced address when address supplied to Identity', () => {
    useIdentityContextMock.mockReturnValue({ address: mockAddress });
    (getSlicedAddress as vi.Mock).mockReturnValue(
      mockGetSlicedAddress(mockAddress)
    );

    const { getByText } = render(<Address />);
    expect(getByText(mockGetSlicedAddress(mockAddress))).toBeInTheDocument();
  });

  it('renders the sliced address when address supplied to Identity', () => {
    useIdentityContextMock.mockReturnValue({});
    (getSlicedAddress as vi.Mock).mockReturnValue(
      mockGetSlicedAddress(mockAddress)
    );

    const { getByText } = render(<Address address={mockAddress} />);
    expect(getByText(mockGetSlicedAddress(mockAddress))).toBeInTheDocument();
  });

  it('displays sliced address when ENS name is not available and isSliced is set to true', () => {
    useIdentityContextMock.mockReturnValue({});
    (getSlicedAddress as vi.Mock).mockReturnValue(
      mockGetSlicedAddress(mockAddress)
    );

    render(<Address address={mockAddress} isSliced={true} />);
    expect(
      screen.getByText(mockGetSlicedAddress(mockAddress))
    ).toBeInTheDocument();
    expect(getSlicedAddress).toHaveBeenCalledWith(mockAddress);
  });

  it('displays full address when isSliced is false and ENS name is not available', () => {
    useIdentityContextMock.mockReturnValue({});
    render(<Address address={mockAddress} isSliced={false} />);
    expect(screen.getByText(mockAddress)).toBeInTheDocument();
    expect(getSlicedAddress).not.toHaveBeenCalled();
  });
});
