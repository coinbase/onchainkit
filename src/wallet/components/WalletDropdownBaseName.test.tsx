import type { UseQueryResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { GetAccountReturnType } from '@wagmi/core';
import { base } from 'viem/chains';
import { describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useName } from '../../identity/hooks/useName';
import { WalletDropdownBaseName } from './WalletDropdownBaseName';
import { useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('../../identity/hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

describe('WalletDropdownBaseName', () => {
  it('should render "Claim a Basename" when no basename', () => {
    (useAccount as vi.Mock<[], Partial<GetAccountReturnType>>).mockReturnValue({
      address: '0x1234' as `0x${string}`,
      isConnected: true,
    });
    (useWalletContext as vi.Mock).mockReturnValue({
      chain: base,
    });
    (
      useName as vi.Mock<[], Partial<UseQueryResult<string | null, Error>>>
    ).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<WalletDropdownBaseName />);
    expect(screen.getByText('Claim a Basename')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('should render "Go to profile" when basename exists', () => {
    (useAccount as vi.Mock<[], Partial<GetAccountReturnType>>).mockReturnValue({
      address: '0x1234' as `0x${string}`,
      isConnected: true,
    });
    (useWalletContext as vi.Mock).mockReturnValue({
      chain: base,
    });
    (
      useName as vi.Mock<[], Partial<UseQueryResult<string | null, Error>>>
    ).mockReturnValue({
      data: 'test.base',
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<WalletDropdownBaseName />);
    expect(screen.getByText('Go to profile')).toBeInTheDocument();
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('should render Spinner when loading', () => {
    (useAccount as vi.Mock<[], Partial<GetAccountReturnType>>).mockReturnValue({
      address: '0x1234' as `0x${string}`,
      isConnected: true,
    });
    (useWalletContext as vi.Mock).mockReturnValue({
      chain: base,
    });
    (
      useName as vi.Mock<[], Partial<UseQueryResult<string | null, Error>>>
    ).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<WalletDropdownBaseName />);
    expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
    expect(screen.queryByText('Claim a Basename')).not.toBeInTheDocument();
    expect(screen.queryByText('Go to profile')).not.toBeInTheDocument();
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('should return null if there is no address', () => {
    (useAccount as vi.Mock<[], Partial<GetAccountReturnType>>).mockReturnValue({
      address: undefined,
      isConnected: false,
    });
    (useWalletContext as vi.Mock).mockReturnValue({
      chain: base,
    });

    const { container } = render(<WalletDropdownBaseName />);
    expect(container.firstChild).toBeNull();
  });
});
