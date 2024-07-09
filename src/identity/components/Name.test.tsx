/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { getSlicedAddress } from '../getSlicedAddress';
import { useName } from '../hooks/useName';
import { useAttestations } from '../hooks/useAttestations';
import { Name } from './Name';
import { Badge } from './Badge';
import { useIdentityContext } from './IdentityProvider';
import { silenceError } from '../../internal/testing';

jest.mock('../hooks/useName', () => ({
  useName: jest.fn(),
}));

jest.mock('../getSlicedAddress', () => ({
  getSlicedAddress: jest.fn(),
}));

jest.mock('./IdentityProvider', () => ({
  useIdentityContext: jest.fn(),
}));

jest.mock('../hooks/useAttestations', () => ({
  useAttestations: jest.fn(),
}));

const mockSliceAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

describe('OnchainAddress', () => {
  const testAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const testName = 'testname.eth';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  it('should throw an error when no address is provided', () => {
    (useIdentityContext as jest.Mock).mockReturnValue({
      schemaId: '0x123',
    });
    const restore = silenceError();
    expect(() => {
      render(<Name />);
    }).toThrow(
      'Name: an Ethereum address must be provided to the Identity or Name component.',
    );
    restore();
  });

  it('displays ENS name when available', () => {
    (useIdentityContext as jest.Mock).mockReturnValue({
      schemaId: '0x123',
    });
    (useName as jest.Mock).mockReturnValue({
      data: testName,
      isLoading: false,
    });
    render(<Name address={testAddress} />);
    expect(screen.getByText(testName)).toBeInTheDocument();
  });

  it('returns null when ENS name is not available', () => {
    (useIdentityContext as jest.Mock).mockReturnValue({
      schemaId: '0x123',
    });
    (useName as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });
    const { container } = render(<Name address={testAddress} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays empty when ens still fetching', () => {
    (useName as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    render(<Name address={testAddress} />);
    expect(screen.queryByText(testName)).not.toBeInTheDocument();
    expect(getSlicedAddress).toHaveBeenCalledTimes(0);
  });

  it('renders badge when Badge is passed, user is attested and address set in Identity', async () => {
    (useIdentityContext as jest.Mock).mockReturnValue({
      address: testAddress,
      schemaId: '0x123',
    });
    (useAttestations as jest.Mock).mockReturnValue(['attestation']);
    (useName as jest.Mock).mockReturnValue({
      data: 'ens_name',
      isLoading: false,
    });

    render(
      <Name address={testAddress}>
        <Badge />
      </Name>,
    );

    await waitFor(() => {
      const badge = screen.getByTestId('ockBadge');
      expect(badge).toBeInTheDocument();
    });
  });

  it('renders badge when Badge is passed, user is attested and address set in Name', async () => {
    (useIdentityContext as jest.Mock).mockReturnValue({
      schemaId: '0x123',
    });
    (useAttestations as jest.Mock).mockReturnValue(['attestation']);
    (useName as jest.Mock).mockReturnValue({
      address: testAddress,
      data: 'ens_name',
      isLoading: false,
    });

    render(
      <Name address={testAddress}>
        <Badge />
      </Name>,
    );

    await waitFor(() => {
      const badge = screen.getByTestId('ockBadge');
      expect(badge).toBeInTheDocument();
    });
  });
});
