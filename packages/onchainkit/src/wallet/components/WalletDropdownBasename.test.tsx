import { useName } from '@/identity/hooks/useName';
import type { UseQueryResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { base, mainnet } from 'viem/chains';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { WalletDropdownBasename } from './WalletDropdownBasename';
import { useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/identity/hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

type GetAccountReturnType = ReturnType<typeof useAccount>;

describe('WalletDropdownBasename', () => {
  it('should render "Claim Basename" when no basename', () => {
    (useAccount as Mock<() => Partial<GetAccountReturnType>>).mockReturnValue({
      address: '0x1234' as `0x${string}`,
      isConnected: true,
    });
    (useWalletContext as Mock).mockReturnValue({
      chain: base,
    });
    (
      useName as Mock<() => Partial<UseQueryResult<string | null, Error>>>
    ).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<WalletDropdownBasename />);
    expect(screen.getByText('Claim Basename')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('should render "Profile" when basename exists', () => {
    (useAccount as Mock<() => Partial<GetAccountReturnType>>).mockReturnValue({
      address: '0x1234' as `0x${string}`,
      isConnected: true,
    });
    (useWalletContext as Mock).mockReturnValue({
      chain: base,
    });
    (
      useName as Mock<() => Partial<UseQueryResult<string | null, Error>>>
    ).mockReturnValue({
      data: 'test.base',
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<WalletDropdownBasename />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('should render Spinner when loading', () => {
    (useAccount as Mock<() => Partial<GetAccountReturnType>>).mockReturnValue({
      address: '0x1234' as `0x${string}`,
      isConnected: true,
    });
    (useWalletContext as Mock).mockReturnValue({
      chain: base,
    });
    (
      useName as Mock<() => Partial<UseQueryResult<string | null, Error>>>
    ).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<WalletDropdownBasename />);
    expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
    expect(screen.queryByText('Claim Basename')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('should return null if there is no address', () => {
    (useAccount as Mock<() => Partial<GetAccountReturnType>>).mockReturnValue({
      address: undefined,
      isConnected: false,
    });
    (useWalletContext as Mock).mockReturnValue({
      chain: base,
    });

    const { container } = render(<WalletDropdownBasename />);
    expect(container.firstChild).toBeNull();
  });

  it('should render "Claim Basename" regardless of chain', () => {
    (useAccount as Mock<() => Partial<GetAccountReturnType>>).mockReturnValue({
      address: '0x1234' as `0x${string}`,
      isConnected: true,
    });
    (useWalletContext as Mock).mockReturnValue({
      chain: mainnet,
    });
    (
      useName as Mock<() => Partial<UseQueryResult<string | null, Error>>>
    ).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<WalletDropdownBasename />);
    expect(screen.getByText('Claim Basename')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('should render "Profile" when basename exists', () => {
    (useAccount as Mock<() => Partial<GetAccountReturnType>>).mockReturnValue({
      address: '0x1234' as `0x${string}`,
      isConnected: true,
    });
    (useWalletContext as Mock).mockReturnValue({
      chain: mainnet,
    });
    (
      useName as Mock<() => Partial<UseQueryResult<string | null, Error>>>
    ).mockReturnValue({
      data: 'test.base',
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<WalletDropdownBasename />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });
});
