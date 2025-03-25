import '@testing-library/jest-dom';
import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { NFTProvider } from '@/nft/components/NFTProvider';
import { render } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useAccount } from 'wagmi';
import { NFTCard } from './NFTCard';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));
vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(() => 'default-light'),
}));
vi.mock('@/internal/hooks/useIsMounted');
vi.mock('@/nft/components/NFTProvider', () => ({
  NFTProvider: vi.fn(({ children }) => <div>{children}</div>),
}));
vi.mock('./view', () => ({
  NFTMedia: () => <div data-testid="nft-media" />,
  NFTTitle: () => <div data-testid="nft-title" />,
  NFTOwner: () => <div data-testid="nft-owner" />,
  NFTLastSoldPrice: () => <div data-testid="nft-last-sold-price" />,
  NFTNetwork: () => <div data-testid="nft-network" />,
}));

describe('NFTView', () => {
  beforeEach(() => {
    (useIsMounted as Mock).mockReturnValue(true);
    (useAccount as Mock).mockReturnValue({ chain: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly when mounted', () => {
    const { getByTestId, getByText } = render(
      <NFTCard contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NFTCard>,
    );

    expect(getByTestId('ockNFTCard_Container')).toBeInTheDocument();
    expect(getByText('Child Component')).toBeInTheDocument();
    expect(getByTestId('ockNFTCard_Container')).toHaveClass('test-class');
  });

  it('should not render when not mounted', () => {
    (useIsMounted as Mock).mockReturnValue(false);

    const { queryByTestId } = render(
      <NFTCard contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NFTCard>,
    );

    expect(queryByTestId('ockNFTCard_Container')).not.toBeInTheDocument();
  });

  it('should render default content when no children are provided', () => {
    const { getByTestId } = render(
      <NFTCard contractAddress="0x123" tokenId="1" />,
    );
    expect(getByTestId('nft-media')).toBeInTheDocument();
    expect(getByTestId('nft-title')).toBeInTheDocument();
    expect(getByTestId('nft-owner')).toBeInTheDocument();
    expect(getByTestId('nft-last-sold-price')).toBeInTheDocument();
    expect(getByTestId('nft-network')).toBeInTheDocument();
  });

  it('should pass contractAddress and tokenId to NFTProvider', () => {
    render(
      <NFTCard contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NFTCard>,
    );

    expect(NFTProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: '0x123',
        tokenId: '1',
      }),
      {},
    );
  });

  it('should go to zora onclick when on base chain', () => {
    window.open = vi.fn();
    (useAccount as Mock).mockReturnValue({ chain: { name: 'Base' } });
    const { getByTestId } = render(
      <NFTCard contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NFTCard>,
    );

    const button = getByTestId('ockNFTCard_Container');
    button.click();

    expect(window.open).toHaveBeenCalledWith(
      'https://zora.co/collect/base:0x123/1',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('should go to zora onclick defaulting to base when chain is null', () => {
    window.open = vi.fn();
    const { getByTestId } = render(
      <NFTCard contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NFTCard>,
    );

    const button = getByTestId('ockNFTCard_Container');
    button.click();

    expect(window.open).toHaveBeenCalledWith(
      'https://zora.co/collect/base:0x123/1',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
