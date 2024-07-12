/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { base } from 'viem/chains';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useOnchainKit } from '../../useOnchainKit';
import { useName } from '../hooks/useName';
import { useAttestations } from '../hooks/useAttestations';
import { useAvatar } from '../hooks/useAvatar';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

const silenceError = () => {
  const consoleErrorMock = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  return () => consoleErrorMock.mockRestore();
};
vi.mock('../../useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('../hooks/useAttestations', () => ({
  useAttestations: vi.fn(),
}));

vi.mock('../hooks/useAvatar', () => ({
  useAvatar: vi.fn(),
}));

vi.mock('../hooks/useName', () => ({
  useName: vi.fn(),
}));

describe('Avatar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error when no address is provided', () => {
    const restore = silenceError();
    expect(() => {
      render(<Avatar />);
    }).toThrow(
      'Avatar: an Ethereum address must be provided to the Identity or Avatar component.',
    );
    restore();
  });

  it('should display loading indicator when loading', async () => {
    (useAvatar as vi.Mock).mockReturnValue({ data: null, isLoading: true });
    (useName as vi.Mock).mockReturnValue({ data: null, isLoading: true });

    render(<Avatar address="0x123" />);

    await waitFor(() => {
      const svgElement = screen.getByTestId('ockAvatarLoadingSvg');
      expect(svgElement).toBeInTheDocument();
    });
  });

  it('should display default avatar when no ENS name or avatar is available', async () => {
    (useAvatar as vi.Mock).mockReturnValue({ data: null, isLoading: false });
    (useName as vi.Mock).mockReturnValue({ data: null, isLoading: false });

    render(<Avatar address="0x123" />);

    await waitFor(() => {
      const defaultAvatarElement = screen.getByTestId('ockAvatarDefaultSvg');
      expect(defaultAvatarElement).toBeInTheDocument();
    });
  });

  it('should display ENS avatar when available', async () => {
    (useAvatar as vi.Mock).mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    (useName as vi.Mock).mockReturnValue({
      data: 'ens_name',
      isLoading: false,
    });

    render(<Avatar address="0x123" className="custom-class" />);

    await waitFor(() => {
      const imgElement = screen.getByTestId('ockAvatar_Image');
      expect(imgElement).toHaveAttribute('src', 'avatar_url');
      expect(imgElement).toHaveAttribute('alt', 'ens_name');
      const containerElement = screen.getByTestId('ockAvatar_ImageContainer');
      expect(containerElement).toHaveClass('custom-class');
    });
  });

  it('renders custom loading component when provided', () => {
    (useAvatar as vi.Mock).mockReturnValue({ data: null, isLoading: true });
    (useName as vi.Mock).mockReturnValue({ data: null, isLoading: true });

    const CustomLoadingComponent = (
      <div data-testid="ockAvatarCustomLoading">Loading...</div>
    );

    render(
      <Avatar address="0x123" loadingComponent={CustomLoadingComponent} />,
    );

    const customLoadingElement = screen.getByTestId('ockAvatarCustomLoading');
    expect(customLoadingElement).toBeInTheDocument();
    expect(customLoadingElement).toHaveTextContent('Loading...');
  });

  it('renders custom default component when no ENS name or avatar is available', () => {
    (useAvatar as vi.Mock).mockReturnValue({ data: null, isLoading: false });
    (useName as vi.Mock).mockReturnValue({ data: null, isLoading: false });

    const CustomDefaultComponent = (
      <div data-testid="ockAvatarCustomDefault">Default Avatar</div>
    );

    render(
      <Avatar address="0x123" defaultComponent={CustomDefaultComponent} />,
    );

    const customDefaultElement = screen.getByTestId('ockAvatarCustomDefault');
    expect(customDefaultElement).toBeInTheDocument();
    expect(customDefaultElement).toHaveTextContent('Default Avatar');
  });

  it('renders badge when Badge is passed as a child is true', async () => {
    (useOnchainKit as vi.Mock).mockReturnValue({
      chain: base,
      schemaId: '0xschema',
    });
    (useAttestations as vi.Mock).mockReturnValue([{}]);
    (useAvatar as vi.Mock).mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    (useName as vi.Mock).mockReturnValue({
      data: 'ens_name',
      isLoading: false,
    });

    render(
      <Avatar address="0x123">
        <Badge />
      </Avatar>,
    );

    await waitFor(() => {
      const inner = screen.getByTestId('ockAvatar_BadgeContainer');
      expect(inner).toBeInTheDocument();
      const badge = screen.getByTestId('ockBadge');
      expect(badge).toBeInTheDocument();
    });
  });
});
