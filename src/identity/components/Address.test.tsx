/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Address } from './Address';
import { useIdentityContext } from './IdentityProvider';
import { getSlicedAddress } from '../getSlicedAddress';
import { mock, silenceError } from '../../internal/testing';

jest.mock('./IdentityProvider', () => ({
  useIdentityContext: jest.fn(),
}));

const useIdentityContextMock = mock(useIdentityContext);

describe('Address component', () => {
  const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';

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
    useIdentityContextMock.mockReturnValue({ address: mockAddress });

    const { getByText } = render(<Address />);

    expect(getByText(getSlicedAddress(mockAddress))).toBeInTheDocument();
  });

  it('renders the sliced address when address supplied to Identity', () => {
    const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
    useIdentityContextMock.mockReturnValue({});

    const { getByText } = render(<Address address={mockAddress} />);

    expect(getByText(getSlicedAddress(mockAddress))).toBeInTheDocument();
  });
});
