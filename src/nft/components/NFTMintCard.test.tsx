import '@testing-library/jest-dom';
import { useIsMounted } from '@/internal/hooks/useIsMounted';
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
import { NFTMintCard } from './NFTMintCard';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(() => 'default-light'),
}));
vi.mock('@/internal/hooks/useIsMounted');
vi.mock('@/nft/components/NFTProvider', () => ({
  NFTProvider: vi.fn(({ children }) => <div>{children}</div>),
}));

describe('NFTMintCard', () => {
  beforeEach(() => {
    (useIsMounted as Mock).mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly when mounted', () => {
    const { getByTestId, getByText } = render(
      <NFTMintCard contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NFTMintCard>,
    );

    expect(getByTestId('ockNFTMintCard_Container')).toBeInTheDocument();
    expect(getByText('Child Component')).toBeInTheDocument();
    expect(getByTestId('ockNFTMintCard_Container')).toHaveClass('test-class');
  });

  it('should not render when not mounted', () => {
    (useIsMounted as Mock).mockReturnValue(false);

    const { queryByTestId } = render(
      <NFTMintCard contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NFTMintCard>,
    );

    expect(queryByTestId('ockNFTMintCard_Container')).not.toBeInTheDocument();
  });
});
