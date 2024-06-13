/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Name } from './Name';
import { useName } from '../hooks/useName';
import { getSlicedAddress } from '../getSlicedAddress';

import '@testing-library/jest-dom';

// Mocking the hooks and utilities
jest.mock('../hooks/useName', () => ({
  useName: jest.fn(),
}));
jest.mock('../getSlicedAddress', () => ({
  getSlicedAddress: jest.fn(),
}));

const mockSliceAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

describe('OnchainAddress', () => {
  const testAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const testName = 'testname.eth';

  beforeEach(() => {
    jest.clearAllMocks();
    (getSlicedAddress as jest.Mock).mockImplementation(mockSliceAddress);
  });

  it('displays ENS name when available', () => {
    (useName as jest.Mock).mockReturnValue({
      data: testName,
      isLoading: false,
    });

    render(<Name address={testAddress} />);

    expect(screen.getByText(testName)).toBeInTheDocument();
    expect(getSlicedAddress).toHaveBeenCalledTimes(0);
  });

  it('displays sliced address when ENS name is not available', () => {
    (useName as jest.Mock).mockReturnValue({
      data: mockSliceAddress(testAddress),
      isLoading: false,
    });

    render(<Name address={testAddress} />);

    expect(screen.getByText(mockSliceAddress(testAddress))).toBeInTheDocument();
  });

  it('displays empty when ens still fetching', () => {
    (useName as jest.Mock).mockReturnValue({ data: null, isLoading: true });

    render(<Name address={testAddress} />);

    expect(
      screen.queryByText(mockSliceAddress(testAddress)),
    ).not.toBeInTheDocument();
    expect(getSlicedAddress).toHaveBeenCalledTimes(0);
  });

  it('displays sliced address when ENS name is available but showAddress is true', () => {
    (useName as jest.Mock).mockReturnValue({
      data: mockSliceAddress(testAddress),
      isLoading: false,
    });

    render(<Name address={testAddress} showAddress />);

    expect(screen.getByText(mockSliceAddress(testAddress))).toBeInTheDocument();
  });

  it('displays sliced address when ENS name is not available', () => {
    (useName as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<Name address={testAddress} />);

    expect(screen.getByText(mockSliceAddress(testAddress))).toBeInTheDocument();
  });
});
