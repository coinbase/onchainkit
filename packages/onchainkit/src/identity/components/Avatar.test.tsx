import { base, baseSepolia, optimism } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { useAttestations } from '@/identity/hooks/useAttestations';
import { useAvatar } from '@/identity/hooks/useAvatar';
import { useName } from '@/identity/hooks/useName';
import { useOnchainKit } from '@/useOnchainKit';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

function mock<T>(func: T) {
  return func as Mock;
}

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('@/identity/hooks/useAttestations', () => ({
  useAttestations: vi.fn(),
}));

vi.mock('@/identity/hooks/useAvatar', () => ({
  useAvatar: vi.fn(),
}));

vi.mock('@/identity/hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('@/identity/components/IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

const useIdentityContextMock = mock(useIdentityContext);
const useAvatarMock = mock(useAvatar);
const useNameMock = mock(useName);
const useOnchainKitMock = mock(useOnchainKit);
const useAttestationsMock = mock(useAttestations);

describe('Avatar Component', () => {
  const testIdentityProviderAddress = '0xIdentityAddress';
  const testAvatarComponentAddress = '0xAvatarComponentAddress';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should console.error and return null when no address is provided', () => {
    vi.mocked(useIdentityContext).mockReturnValue({
      // @ts-expect-error - Testing undefined address case
      address: undefined,
      chain: undefined,
    });
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { container } = render(<Avatar />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Avatar: an Ethereum address must be provided to the Identity or Avatar component.',
    );
    expect(container.firstChild).toBeNull();
  });

  it('should display loading indicator when loading', async () => {
    useIdentityContextMock.mockReturnValue({ address: null });
    useAvatarMock.mockReturnValue({ data: null, isLoading: true });
    useNameMock.mockReturnValue({ data: null, isLoading: true });
    render(<Avatar address={testAvatarComponentAddress} />);
    await waitFor(() => {
      const svgElement = screen.getByTestId('ock-defaultLoadingSVG');
      expect(svgElement).toBeInTheDocument();
    });
  });

  it('should display default avatar when no ENS name or avatar is available', async () => {
    useIdentityContextMock.mockReturnValue({ address: null });
    useAvatarMock.mockReturnValue({ data: null, isLoading: false });
    useNameMock.mockReturnValue({ data: null, isLoading: false });
    render(<Avatar address={testAvatarComponentAddress} />);
    await waitFor(() => {
      const defaultAvatarElement = screen.getByTestId('ock-defaultAvatarSVG');
      expect(defaultAvatarElement).toBeInTheDocument();
    });
  });

  it('should display ENS avatar when available', async () => {
    useIdentityContextMock.mockReturnValue({ address: null });
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({
      data: 'ens_name',
      isLoading: false,
    });
    render(
      <Avatar address={testAvatarComponentAddress} className="custom-class" />,
    );
    await waitFor(() => {
      const imgElement = screen.getByTestId('ockAvatar_Image');
      expect(imgElement).toHaveAttribute('src', 'avatar_url');
      expect(imgElement).toHaveAttribute('alt', 'ens_name');
      const containerElement = screen.getByTestId('ockAvatar_ImageContainer');
      expect(containerElement).toHaveClass('custom-class');
    });
  });

  it('renders custom loading component when provided', () => {
    useIdentityContextMock.mockReturnValue({ address: null });
    useAvatarMock.mockReturnValue({ data: null, isLoading: true });
    useNameMock.mockReturnValue({ data: null, isLoading: true });
    const CustomLoadingComponent = (
      <div data-testid="ockAvatarCustomLoading">Loading...</div>
    );
    render(
      <Avatar
        address={testAvatarComponentAddress}
        loadingComponent={CustomLoadingComponent}
      />,
    );
    const customLoadingElement = screen.getByTestId('ockAvatarCustomLoading');
    expect(customLoadingElement).toBeInTheDocument();
    expect(customLoadingElement).toHaveTextContent('Loading...');
  });

  it('renders custom default component when no ENS name or avatar is available', () => {
    useIdentityContextMock.mockReturnValue({ address: null });
    useAvatarMock.mockReturnValue({ data: null, isLoading: false });
    useNameMock.mockReturnValue({ data: null, isLoading: false });
    const CustomDefaultComponent = (
      <div data-testid="ockAvatarCustomDefault">Default Avatar</div>
    );
    render(
      <Avatar
        address={testAvatarComponentAddress}
        defaultComponent={CustomDefaultComponent}
      />,
    );
    const customDefaultElement = screen.getByTestId('ockAvatarCustomDefault');
    expect(customDefaultElement).toBeInTheDocument();
    expect(customDefaultElement).toHaveTextContent('Default Avatar');
  });

  it('renders badge when Badge is passed as a child is true', async () => {
    useIdentityContextMock.mockReturnValue({ address: null });
    useOnchainKitMock.mockReturnValue({
      chain: base,
      schemaId: '0xschema',
    });
    useAttestationsMock.mockReturnValue([{}]);
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({
      data: 'ens_name',
      isLoading: false,
    });
    render(
      <Avatar address={testAvatarComponentAddress}>
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

  it('use identity context address if provided', () => {
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });
    render(<Avatar />);
    expect(useNameMock).toHaveBeenCalledWith({
      address: testIdentityProviderAddress,
    });
  });

  it('use component address over identity context if both are provided', () => {
    useIdentityContextMock.mockReturnValue({
      address: testIdentityProviderAddress,
    });
    render(<Avatar address={testAvatarComponentAddress} />);
    expect(useNameMock).toHaveBeenCalledWith({
      address: testAvatarComponentAddress,
    });
  });

  it('use identity context chain if provided', () => {
    useIdentityContextMock.mockReturnValue({
      chain: optimism,
      address: testIdentityProviderAddress,
    });
    render(<Avatar />);
    expect(useNameMock).toHaveBeenCalledWith({
      address: testIdentityProviderAddress,
      chain: optimism,
    });
  });

  it('use component chain over identity context if both are provided', () => {
    useIdentityContextMock.mockReturnValue({
      chain: optimism,
      address: testIdentityProviderAddress,
    });
    useNameMock.mockReturnValue({
      data: 'ens_name',
      isLoading: false,
    });
    render(<Avatar chain={baseSepolia} />);
    expect(useNameMock).toHaveBeenCalledWith({
      address: testIdentityProviderAddress,
      chain: baseSepolia,
    });
  });
});
