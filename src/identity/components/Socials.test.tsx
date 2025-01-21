import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { useName } from '@/identity/hooks/useName';
import { useSocials } from '@/identity/hooks/useSocials';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Socials } from './Socials';

vi.mock('@/identity/components/IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

vi.mock('@/identity/hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('@/identity/hooks/useSocials', () => ({
  useSocials: vi.fn(),
}));

describe('Socials', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useIdentityContext as ReturnType<typeof vi.fn>).mockReturnValue({
      address: '0x123',
      chain: { id: 1 },
    });
  });

  it('renders null when no address is provided and context is empty', () => {
    (useIdentityContext as ReturnType<typeof vi.fn>).mockReturnValue({
      address: null,
      chain: null,
    });
    const { container } = render(<Socials />);
    expect(container.firstChild).toBeNull();
  });

  it('logs an error and returns null when no address is provided', () => {
    (useIdentityContext as ReturnType<typeof vi.fn>).mockReturnValue({
      address: null,
      chain: null,
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<Socials />);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Socials: an Ethereum address must be provided to the Socials component.',
    );
    expect(container.firstChild).toBeNull();

    consoleSpy.mockRestore();
  });

  it('should render loading state', () => {
    (useName as ReturnType<typeof vi.fn>).mockReturnValue({ isLoading: true });
    (useSocials as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: true,
    });

    const { container } = render(<Socials address="0x123" />);

    const loadingElement = container.querySelector('span');
    expect(loadingElement).toBeInTheDocument();
  });

  it('uses context address and chain when not provided as props', () => {
    const contextAddress = '0x456';
    const contextChain = { id: 5 };
    (useIdentityContext as ReturnType<typeof vi.fn>).mockReturnValue({
      address: contextAddress,
      chain: contextChain,
    });
    (useName as ReturnType<typeof vi.fn>).mockReturnValue({
      data: 'context.eth',
      isLoading: false,
    });
    (useSocials as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { twitter: 'contextuser' },
      isLoading: false,
    });

    render(<Socials />);

    expect(useName).toHaveBeenCalledWith({
      address: contextAddress,
      chain: contextChain,
    });
    expect(useSocials).toHaveBeenCalledWith(
      { ensName: 'context.eth', chain: contextChain },
      { enabled: true },
    );
    expect(screen.getByTestId('ockSocials_Twitter')).toBeInTheDocument();
  });

  it('renders null when no socials are available', () => {
    (useName as ReturnType<typeof vi.fn>).mockReturnValue({
      data: 'test.eth',
      isLoading: false,
    });
    (useSocials as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {},
      isLoading: false,
    });

    const { container } = render(<Socials address="0x123" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders social icons correctly', () => {
    (useName as ReturnType<typeof vi.fn>).mockReturnValue({
      data: 'test.eth',
      isLoading: false,
    });
    (useSocials as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        twitter: 'twitteruser',
        github: 'githubuser',
        farcaster: 'farcasteruser',
        website: 'https://example.com',
      },
      isLoading: false,
    });

    render(<Socials address="0x123" />);

    expect(screen.getByTestId('ockSocials_Twitter')).toHaveAttribute(
      'href',
      'https://x.com/twitteruser',
    );
    expect(screen.getByTestId('ockSocials_Github')).toHaveAttribute(
      'href',
      'https://github.com/githubuser',
    );
    expect(screen.getByTestId('ockSocials_Farcaster')).toHaveAttribute(
      'href',
      'https://warpcast.com/farcasteruser',
    );
    expect(screen.getByTestId('ockSocials_Website')).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('renders only available social icons', () => {
    (useName as ReturnType<typeof vi.fn>).mockReturnValue({
      data: 'test.eth',
      isLoading: false,
    });
    (useSocials as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        twitter: 'twitteruser',
        github: null,
        farcaster: 'farcasteruser',
        website: null,
      },
      isLoading: false,
    });

    render(<Socials address="0x123" />);

    expect(screen.getByTestId('ockSocials_Twitter')).toBeInTheDocument();
    expect(screen.getByTestId('ockSocials_Farcaster')).toBeInTheDocument();
    expect(screen.queryByTestId('ockSocials_Github')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ockSocials_Website')).not.toBeInTheDocument();
  });
});
