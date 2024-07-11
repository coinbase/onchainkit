/**
 * @vitest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar } from './Avatar';
import { Name } from './Name';
import { Identity } from './Identity';
import { useName } from '../hooks/useName';
import { useAvatar } from '../hooks/useAvatar';
import { useGetETHBalance } from '../../wallet/core/useGetETHBalance';
import { Address } from './Address';
import { EthBalance } from './EthBalance';
import { mock } from '../../internal/testing';

vi.mock('../hooks/useAvatar', () => ({
  useAvatar: vi.fn(),
}));
vi.mock('../hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('../../wallet/core/useGetETHBalance', () => ({
  useGetETHBalance: vi.fn(),
}));

const useAvatarMock = mock(useAvatar);
const useNameMock = mock(useName);
const useGetETHBalanceMock = mock(useGetETHBalance);

describe('Identity Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      </Identity>
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
      </Identity>
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
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
      </Identity>
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
      </Identity>
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
    useGetETHBalanceMock.mockReturnValue({ convertedBalance: '0.002' });

    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
        <EthBalance />
      </Identity>
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
    useGetETHBalanceMock.mockReturnValue({ convertedBalance: '0.002' });

    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
        <Address />
        <EthBalance />
      </Identity>
    );

    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
      expect(screen.getByTestId('ockAddress')).toBeInTheDocument();
      expect(screen.getByTestId('ockEthBalance')).toBeInTheDocument();
    });
  });
});
