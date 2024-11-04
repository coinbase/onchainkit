import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { base, baseSepolia, optimism } from 'viem/chains';
import { useName } from '../hooks/useName';
import { getSlicedAddress } from '../utils/getSlicedAddress';
import { useIdentityContext } from './IdentityProvider';
import { Name } from './Name';

vi.mock('../hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('../utils/getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
}));

vi.mock('./IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

describe('Name', () => {
  const testName = 'testname.eth';
  const testIdentityProviderAddress = '0xIdentityAddress';
  const testNameComponentAddress = '0xNameComponentAddress';

  const mockUseName = useName as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  it('should console.error and return null when no address is provided', () => {
    vi.mocked(useIdentityContext).mockReturnValue({
      address: undefined,
      chain: undefined,
    });
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { container } = render(<Name />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Name: an Ethereum address must be provided to the Identity or Name component.',
    );
    expect(container.firstChild).toBeNull();
  });

  it('displays ENS name when available', () => {
    (useIdentityContext as Mock).mockReturnValue({});
    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });
    render(<Name address={testNameComponentAddress} />);
    expect(screen.getByText(testName)).toBeInTheDocument();
  });

  it('use identity context address if provided', () => {
    (useIdentityContext as Mock).mockReturnValue({
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
    (useIdentityContext as Mock).mockReturnValue({
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
    (useIdentityContext as Mock).mockReturnValue({
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
    (useIdentityContext as Mock).mockReturnValue({
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
    (useIdentityContext as Mock).mockReturnValue({});
    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });
    render(<Name address={testNameComponentAddress} chain={baseSepolia} />);
    expect(screen.getByText(testName)).toBeInTheDocument();
  });

  it('displays sliced address when ENS name is not available', () => {
    (useIdentityContext as Mock).mockReturnValue({});
    mockUseName.mockReturnValue({
      data: null,
      isLoading: false,
    });
    (getSlicedAddress as Mock).mockReturnValue('0xName...ess');
    render(<Name address={testNameComponentAddress} />);
    expect(screen.getByText('0xName...ess')).toBeInTheDocument();
  });

  it('displays empty when ens still fetching', () => {
    mockUseName.mockReturnValue({ data: null, isLoading: true });
    render(<Name address={testNameComponentAddress} />);
    expect(screen.queryByText(testName)).not.toBeInTheDocument();
    expect(getSlicedAddress).toHaveBeenCalledTimes(0);
  });
});
