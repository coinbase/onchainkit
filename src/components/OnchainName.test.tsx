/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OnchainName } from './OnchainName';
import { useOnchainName } from '../hooks/useOnchainName';
import { getSlicedAddress } from '../core/address';

// Mocking the hooks and utilities
jest.mock('../hooks/useOnchainName', () => ({
  useOnchainName: jest.fn(),
}));
jest.mock('../core/address', () => ({
  getSlicedAddress: jest.fn(),
}));

const mockSliceAddress = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4);

describe('OnchainAddress', () => {
  const testAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const testName = 'testname.eth';

  beforeEach(() => {
    jest.clearAllMocks();
    (getSlicedAddress as jest.Mock).mockImplementation(mockSliceAddress);
  });

  it('displays ENS name when available', () => {
    (useOnchainName as jest.Mock).mockReturnValue({ ensName: testName, isLoading: false });

    render(<OnchainName address={testAddress} />);

    expect(screen.getByText(testName)).toBeInTheDocument();
    expect(getSlicedAddress).toHaveBeenCalledTimes(0);
  });

  it('displays sliced address when ENS name is not available and sliced is true as default', () => {
    (useOnchainName as jest.Mock).mockReturnValue({ ensName: null, isLoading: false });

    render(<OnchainName address={testAddress} />);

    expect(screen.getByText(mockSliceAddress(testAddress))).toBeInTheDocument();
  });

  it('displays empty when ens still fetching', () => {
    (useOnchainName as jest.Mock).mockReturnValue({ ensName: null, isLoading: true });

    render(<OnchainName address={testAddress} />);

    expect(screen.queryByText(mockSliceAddress(testAddress))).not.toBeInTheDocument();
    expect(getSlicedAddress).toHaveBeenCalledTimes(0);
  });

  it('displays full address when ENS name is not available and sliced is false', () => {
    (useOnchainName as jest.Mock).mockReturnValue({ ensName: null, isLoading: false });

    render(<OnchainName address={testAddress} sliced={false} />);

    expect(screen.getByText(testAddress)).toBeInTheDocument();
  });
});
