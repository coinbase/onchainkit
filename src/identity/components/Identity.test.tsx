import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import '@testing-library/jest-dom';
import { useAvatar } from '@/identity/hooks/useAvatar';
import { useName } from '@/identity/hooks/useName';
import { useGetETHBalance } from '@/wallet/hooks/useGetETHBalance';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Address } from './Address';
import { Avatar } from './Avatar';
import { EthBalance } from './EthBalance';
import { Identity } from './Identity';
import { Name } from './Name';

function mock<T>(func: T) {
  return func as Mock;
}

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  WagmiProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@/identity/hooks/useAvatar', () => ({
  useAvatar: vi.fn(),
}));
vi.mock('@/identity/hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('@/wallet/hooks/useGetETHBalance', () => ({
  useGetETHBalance: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

const useAvatarMock = mock(useAvatar);
const useNameMock = mock(useName);
const useGetEthBalanceMock = mock(useGetETHBalance);
const useAccountMock = mock(useAccount);

describe('Identity Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(window, {
      navigator: {
        clipboard: {
          writeText: vi.fn(),
        },
      },
    });
    useAccountMock.mockReturnValue({ address: '123' });
  });

  it('should render the Identity component with Avatar', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    render(
      <Identity address="0x123456789">
        <Avatar />
      </Identity>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Name', async () => {
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    render(
      <Identity address="0x123456789">
        <Name />
      </Identity>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
    });
  });

  it('should return null if no address provided', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    useAccountMock.mockReturnValue({ address: undefined });
    render(
      <Identity>
        <Avatar />
      </Identity>,
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId('ockIdentityLayout_container'),
      ).not.toBeInTheDocument();
    });
  });

  it('should render the Identity component with Avatar and Name', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
      </Identity>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Avatar, Name and Address', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });

    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
        <Address />
      </Identity>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
      expect(screen.getByTestId('ockAddress')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Avatar, Name, and EthBalance', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    useGetEthBalanceMock.mockReturnValue({ convertedBalance: '0.002' });

    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
        <EthBalance />
      </Identity>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
      expect(screen.getByTestId('ockEthBalance')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Avatar, Name, Address and EthBalance', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    useGetEthBalanceMock.mockReturnValue({ convertedBalance: '0.002' });

    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
        <Address />
        <EthBalance />
      </Identity>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
      expect(screen.getByTestId('ockAddress')).toBeInTheDocument();
      expect(screen.getByTestId('ockEthBalance')).toBeInTheDocument();
    });
  });

  it('should disable copy when hasCopyAddressOnClick is false', async () => {
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined);
    window.navigator.clipboard.writeText = clipboardWriteText;

    render(
      <Identity address="0x123456789" hasCopyAddressOnClick={false}>
        <Address />
      </Identity>,
    );

    const container = screen.getByTestId('ockIdentityLayout_container');
    await fireEvent.click(container);

    expect(clipboardWriteText).not.toHaveBeenCalled();
  });

  it('should handle undefined address correctly', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });

    render(
      <Identity address={undefined}>
        <Avatar />
        <Name />
        <Address />
      </Identity>,
    );

    expect(
      screen.getByTestId('ockIdentityLayout_container'),
    ).toBeInTheDocument();
  });

  it('should return false when trying to copy undefined address', async () => {
    const clipboardWriteText = vi.fn();
    window.navigator.clipboard.writeText = clipboardWriteText;

    render(
      <Identity address={undefined}>
        <Address />
      </Identity>,
    );

    const container = screen.getByTestId('ockIdentityLayout_container');
    await fireEvent.click(container);

    expect(clipboardWriteText).not.toHaveBeenCalled();
  });
});
