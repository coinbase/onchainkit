/**
 * @jest-environment jsdom
 */
import React from 'react';
import { base } from 'viem/chains';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useOnchainKit } from '../../useOnchainKit';
import { useName } from '../hooks/useName';
import { useAttestations } from '../hooks/useAttestations';
import { useAvatar } from '../hooks/useAvatar';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

jest.mock('../../useOnchainKit', () => ({
  useOnchainKit: jest.fn(),
}));

jest.mock('../hooks/useAttestations', () => ({
  useAttestations: jest.fn(),
}));

jest.mock('../hooks/useAvatar', () => ({
  useAvatar: jest.fn(),
}));

jest.mock('../hooks/useName', () => ({
  useName: jest.fn(),
}));

describe('Avatar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when no address is provided', () => {
    expect(() => {
      render(<Avatar />);
    }).toThrow(
      'Avatar: an Ethereum address must be provided to the Identity or Avatar component.',
    );
  });

  it('should display loading indicator when loading', async () => {
    (useAvatar as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (useName as jest.Mock).mockReturnValue({ data: null, isLoading: true });

    render(<Avatar address="0x123" />);

    await waitFor(() => {
      const svgElement = screen.getByTestId('ockAvatarLoadingSvg');
      expect(svgElement).toBeInTheDocument();
    });
  });

  it('should display default avatar when no ENS name or avatar is available', async () => {
    (useAvatar as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (useName as jest.Mock).mockReturnValue({ data: null, isLoading: false });

    render(<Avatar address="0x123" />);

    await waitFor(() => {
      const defaultAvatarElement = screen.getByTestId('ockAvatarDefaultSvg');
      expect(defaultAvatarElement).toBeInTheDocument();
    });
  });

  it('should display ENS avatar when available', async () => {
    (useAvatar as jest.Mock).mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    (useName as jest.Mock).mockReturnValue({
      data: 'ens_name',
      isLoading: false,
    });

    render(<Avatar address="0x123" className="custom-class" />);

    await waitFor(() => {
      const imgElement = screen.getByRole('img');
      expect(imgElement).toHaveAttribute('src', 'avatar_url');
      expect(imgElement).toHaveAttribute('alt', 'ens_name');
      expect(imgElement).toHaveClass('custom-class');
    });
  });

  it('renders custom loading component when provided', () => {
    (useAvatar as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (useName as jest.Mock).mockReturnValue({ data: null, isLoading: true });

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
    (useAvatar as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (useName as jest.Mock).mockReturnValue({ data: null, isLoading: false });

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
    (useOnchainKit as jest.Mock).mockReturnValue({
      chain: base,
      schemaId: '0xschema',
    });
    (useAttestations as jest.Mock).mockReturnValue([{}]);
    (useAvatar as jest.Mock).mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    (useName as jest.Mock).mockReturnValue({
      data: 'ens_name',
      isLoading: false,
    });

    render(
      <Avatar address="0x123">
        <Badge />
      </Avatar>,
    );

    await waitFor(() => {
      const inner = screen.getByTestId('ockAvatarBadgeContainer');
      expect(inner).toBeInTheDocument();
      const badge = screen.getByTestId('ockBadge');
      expect(badge).toBeInTheDocument();
    });
  });
});
