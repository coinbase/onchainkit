/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar } from './Avatar';
import { useAvatar } from '../hooks/useAvatar';
import { useName } from '../hooks/useName';

import '@testing-library/jest-dom';

jest.mock('../hooks/useName', () => ({
  useName: jest.fn(),
}));

jest.mock('../hooks/useAvatar', () => ({
  useAvatar: jest.fn(),
}));

describe('Avatar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading indicator when loading', async () => {
    (useAvatar as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (useName as jest.Mock).mockReturnValue({ data: null, isLoading: true });

    render(<Avatar address="0x123" />);

    await waitFor(() => {
      const svgElement = screen.getByTestId('avatar-loading-svg');
      expect(svgElement).toBeInTheDocument();
    });
  });

  it('should display default avatar when no ENS name or avatar is available', async () => {
    (useAvatar as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (useName as jest.Mock).mockReturnValue({ data: null, isLoading: false });

    render(<Avatar address="0x123" />);

    await waitFor(() => {
      const defaultAvatarElement = screen.getByTestId('avatar-default-svg');
      expect(defaultAvatarElement).toBeInTheDocument();
    });
  });

  it('should display ENS avatar when available', async () => {
    (useAvatar as jest.Mock).mockReturnValue({ data: 'avatar_url', isLoading: false });
    (useName as jest.Mock).mockReturnValue({ data: 'ens_name', isLoading: false });

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

    const CustomLoadingComponent = <div data-testid="custom-loading">Loading...</div>;

    render(<Avatar address="0x123" loadingComponent={CustomLoadingComponent} />);

    const customLoadingElement = screen.getByTestId('custom-loading');
    expect(customLoadingElement).toBeInTheDocument();
    expect(customLoadingElement).toHaveTextContent('Loading...');
  });

  it('renders custom default component when no ENS name or avatar is available', () => {
    (useAvatar as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (useName as jest.Mock).mockReturnValue({ data: null, isLoading: false });

    const CustomDefaultComponent = <div data-testid="custom-default">Default Avatar</div>;

    render(<Avatar address="0x123" defaultComponent={CustomDefaultComponent} />);

    const customDefaultElement = screen.getByTestId('custom-default');
    expect(customDefaultElement).toBeInTheDocument();
    expect(customDefaultElement).toHaveTextContent('Default Avatar');
  });
});
