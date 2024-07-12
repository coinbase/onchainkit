/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { vi, type Mock } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { getSlicedAddress } from '../getSlicedAddress';
import { useName } from '../hooks/useName';
import { useAttestations } from '../hooks/useAttestations';
import { Name } from './Name';
import { Badge } from './Badge';
import { useIdentityContext } from './IdentityProvider';
import { base, baseSepolia, optimism } from 'viem/chains';

const silenceError = () => {
  const consoleErrorMock = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  return () => consoleErrorMock.mockRestore();
};

vi.mock('../hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('../getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
}));

vi.mock('./IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

vi.mock('../hooks/useAttestations', () => ({
  useAttestations: vi.fn(),
}));

const mockSliceAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

describe('Name', () => {
  const testName = 'testname.eth';
  const testIdentityProviderAddress = '0xIdentityAddress';
  const testNameComponentAddress = '0xNameComponentAddress';

  const mockUseName = useName as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  it('should throw an error when no address is provided', () => {
    (useIdentityContext as vi.Mock).mockReturnValue({
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
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: '0x123',
    });
    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });
    render(<Name address={testNameComponentAddress} />);
    expect(screen.getByText(testName)).toBeInTheDocument();
  });

  it('use identity context address if provided', () => {
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: '0x123',
      address: testIdentityProviderAddress,
    });

    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });

    render(<Name />);

    expect(mockUseName).toHaveBeenCalledWith({
      address: testIdentityProviderAddress,
      chain: undefined,
    });
  });

  it('use identity context chain if provided', () => {
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: '0x123',
      chain: optimism,
    });

    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });

    render(<Name address={testNameComponentAddress} />);

    expect(mockUseName).toHaveBeenCalledWith({
      address: testNameComponentAddress,
      chain: optimism,
    });
  });

  it('use component address over identity context if both are provided', () => {
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: '0x123',
      chain: optimism,
      address: testIdentityProviderAddress,
    });

    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });

    render(<Name address={testNameComponentAddress} />);

    expect(mockUseName).toHaveBeenCalledWith({
      address: testNameComponentAddress,
      chain: optimism,
    });
  });

  it('use component chain over identity context if both are provided', () => {
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: '0x123',
      chain: optimism,
      address: testIdentityProviderAddress,
    });

    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });

    render(<Name address={testNameComponentAddress} chain={base} />);

    expect(mockUseName).toHaveBeenCalledWith({
      address: testNameComponentAddress,
      chain: base,
    });
  });

  it('displays custom chain ENS name when available', () => {
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: '0x123',
    });
    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });
    render(<Name address={testNameComponentAddress} chain={baseSepolia} />);
    expect(screen.getByText(testName)).toBeInTheDocument();
  });

  it('returns null when ENS name is not available', () => {
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: '0x123',
    });
    mockUseName.mockReturnValue({
      data: null,
      isLoading: false,
    });
    const { container } = render(<Name address={testNameComponentAddress} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays empty when ens still fetching', () => {
    mockUseName.mockReturnValue({ data: null, isLoading: true });
    render(<Name address={testNameComponentAddress} />);
    expect(screen.queryByText(testName)).not.toBeInTheDocument();
    expect(getSlicedAddress).toHaveBeenCalledTimes(0);
  });

  it('renders badge when Badge is passed, user is attested and address set in Identity', async () => {
    (useIdentityContext as vi.Mock).mockReturnValue({
      address: testNameComponentAddress,
      schemaId: '0x123',
    });
    (useAttestations as vi.Mock).mockReturnValue(['attestation']);
    mockUseName.mockReturnValue({
      data: 'ens_name',
      isLoading: false,
    });

    render(
      <Name address={testNameComponentAddress}>
        <Badge />
      </Name>,
    );

    await waitFor(() => {
      const badge = screen.getByTestId('ockBadge');
      expect(badge).toBeInTheDocument();
    });
  });

  it('renders badge when Badge is passed, user is attested and address set in Name', async () => {
    (useIdentityContext as vi.Mock).mockReturnValue({
      schemaId: '0x123',
    });
    (useAttestations as vi.Mock).mockReturnValue(['attestation']);
    mockUseName.mockReturnValue({
      address: testNameComponentAddress,
      data: 'ens_name',
      isLoading: false,
    });

    render(
      <Name address={testNameComponentAddress}>
        <Badge />
      </Name>,
    );

    await waitFor(() => {
      const badge = screen.getByTestId('ockBadge');
      expect(badge).toBeInTheDocument();
    });
  });
});
