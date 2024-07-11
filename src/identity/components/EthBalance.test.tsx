/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EthBalance } from './EthBalance';
import { useIdentityContext } from './IdentityProvider';
import { useGetETHBalance } from '../../wallet/core/useGetETHBalance';
import { getRoundedAmount } from '../../utils/getRoundedAmount';
import { silenceError, mock } from '../../internal/testing';

vi.mock('./IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

vi.mock('../../wallet/core/useGetETHBalance', () => ({
  useGetETHBalance: vi.fn(),
}));

vi.mock('../../utils/getRoundedAmount', () => ({
  getRoundedAmount: vi.fn(),
}));

const useIdentityContextMock = mock(useIdentityContext);
const useGetETHBalanceMock = mock(useGetETHBalance);

describe('EthBalance', () => {
  it('should throw an error if no address is provided', () => {
    useIdentityContextMock.mockReturnValue({ address: null });

    const restore = silenceError();
    expect(() =>
      render(<EthBalance address={undefined} className="" />),
    ).toThrow(
      'Address: an Ethereum address must be provided to the Identity or EthBalance component.',
    );
    restore();
  });

  it('should display the balance if provided', () => {
    const address = '0x1234567890abcdef';
    const balance = 1.23456789;
    useIdentityContextMock.mockReturnValue({ address: null });
    useGetETHBalanceMock.mockReturnValue({
      convertedBalance: balance,
      error: null,
    });
    (getRoundedAmount as vi.Mock).mockReturnValue('1.2346');

    render(<EthBalance address={address} className="custom-class" />);

    expect(screen.getByText('1.2346 ETH')).toBeInTheDocument();
  });

  it('should return null if balance is undefined or there is an error', () => {
    const address = '0x1234567890abcdef';
    useIdentityContextMock.mockReturnValue({ address: null });
    useGetETHBalanceMock.mockReturnValue({
      convertedBalance: undefined,
      error: 'Error message',
    });

    const { container } = render(
      <EthBalance address={address} className="custom-class" />,
    );
    expect(container.firstChild).toBeNull();
  });
});
