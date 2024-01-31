/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { OnchainName } from './OnchainName';
import { useEnsName } from '../hooks/useEnsName';
import { getSlicedAddress } from '../core/address';

// Enable jest-dom functions
import '@testing-library/jest-dom';

// Mocking the hooks and utilities
jest.mock('../hooks/useEnsName', () => ({
  useEnsName: jest.fn(),
}));
jest.mock('../core/address', () => ({
  getSlicedAddress: jest.fn(),
}));

describe('OnchainAddress', () => {
  const testAddress = '0x1234567890abcdef1234567890abcdef12345678';

  it('displays ENS name when available', () => {
    (useEnsName as jest.Mock).mockReturnValue({ ensName: 'testname.eth' });
    render(<OnchainName address={testAddress} />);

    expect(screen.getByText('testname.eth')).toBeInTheDocument();
  });

  it('displays sliced address when ENS name is not available and sliced is true as default', () => {
    (useEnsName as jest.Mock).mockReturnValue({ ensName: null });
    (getSlicedAddress as jest.Mock).mockImplementation(
      (addr) => addr.slice(0, 6) + '...' + addr.slice(-4),
    );
    render(<OnchainName address={testAddress} />);
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
  });

  it('displays full address when ENS name is not available and sliced is false', () => {
    (useEnsName as jest.Mock).mockReturnValue({ ensName: null });
    render(<OnchainName address={testAddress} sliced={false} />);
    expect(screen.getByText(testAddress)).toBeInTheDocument();
  });
});
