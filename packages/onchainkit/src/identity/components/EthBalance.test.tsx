import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { getRoundedAmount } from '@/internal/utils/getRoundedAmount';
import { useGetETHBalance } from '@/wallet/hooks/useGetETHBalance';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { EthBalance } from './EthBalance';

function mock<T>(func: T) {
  return func as Mock;
}

vi.mock('@/identity/components/IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

vi.mock('@/wallet/hooks/useGetETHBalance', () => ({
  useGetETHBalance: vi.fn(),
}));

vi.mock('@/internal/utils/getRoundedAmount', () => ({
  getRoundedAmount: vi.fn(),
}));

const useIdentityContextMock = mock(useIdentityContext);
const useGetEthBalanceMock = mock(useGetETHBalance);

describe('EthBalance', () => {
  const testIdentityProviderAddress = '0xIdentityAddress';
  const testEthBalanceComponentAddress = '0xEthBalanceComponentAddress';
  it('should console.error and return null when no address is provided', () => {
    vi.mocked(useIdentityContext).mockReturnValue({
      // @ts-expect-error - Testing undefined address case
      address: undefined,
    });
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { container } = render(<EthBalance />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Address: an Ethereum address must be provided to the Identity or EthBalance component.',
    );
    expect(container.firstChild).toBeNull();
  });

  it('should display the balance if provided', () => {
    const balance = 1.23456789;
    useIdentityContextMock.mockReturnValue({ address: null });
    useGetEthBalanceMock.mockReturnValue({
      convertedBalance: balance,
      error: null,
    });
    (getRoundedAmount as Mock).mockReturnValue('1.2346');

    render(
      <EthBalance
        address={testEthBalanceComponentAddress}
        className="custom-class"
      />,
    );

    expect(screen.getByText('1.2346 ETH')).toBeInTheDocument();
  });

  it('should return null if balance is undefined or there is an error', () => {
    useIdentityContextMock.mockReturnValue({ address: null });
    useGetEthBalanceMock.mockReturnValue({
      convertedBalance: undefined,
      error: 'Error message',
    });

    const { container } = render(
      <EthBalance
        address={testEthBalanceComponentAddress}
        className="custom-class"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('use identity context address if provided', () => {
    const balance = 1.23456789;
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });
    useGetEthBalanceMock.mockReturnValue({
      convertedBalance: balance,
      error: null,
    });
    (getRoundedAmount as Mock).mockReturnValue('1.2346');

    render(<EthBalance className="custom-class" />);

    expect(useGetEthBalanceMock).toHaveBeenCalledWith(
      testIdentityProviderAddress,
    );
  });

  it('use component address over identity context if both are provided', () => {
    const balance = 1.23456789;
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });
    useGetEthBalanceMock.mockReturnValue({
      convertedBalance: balance,
      error: null,
    });
    (getRoundedAmount as Mock).mockReturnValue('1.2346');

    render(
      <EthBalance
        className="custom-class"
        address={testEthBalanceComponentAddress}
      />,
    );

    expect(useGetEthBalanceMock).toHaveBeenCalledWith(
      testEthBalanceComponentAddress,
    );
  });
});
