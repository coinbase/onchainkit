/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Address } from './Address';
import { useIdentityContext } from '../context';
import { getSlicedAddress } from '../getSlicedAddress';

jest.mock('../context', () => ({
  useIdentityContext: jest.fn(),
}));

describe('Address component', () => {
  const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';

  it('should throw an error when no address is provided', () => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    (useIdentityContext as jest.Mock).mockReturnValue({});
    expect(() => {
      render(<Address />);
    }).toThrow(
      'Address: an Ethereum address must be provided to the Identity or Address component.',
    );
  });

  it('renders the sliced address when address supplied to Identity', () => {
    (useIdentityContext as jest.Mock).mockReturnValue({ address: mockAddress });

    const { getByText } = render(<Address />);

    expect(getByText(getSlicedAddress(mockAddress))).toBeInTheDocument();
  });

  it('renders the sliced address when address supplied to Identity', () => {
    const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
    (useIdentityContext as jest.Mock).mockReturnValue({});

    const { getByText } = render(<Address address={mockAddress} />);

    expect(getByText(getSlicedAddress(mockAddress))).toBeInTheDocument();
  });
});
