import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NFTCardDefault } from './NFTCardDefault';

vi.mock('./view', () => ({
  NFTMedia: () => <div data-testid="nft-media">NFT Media</div>,
  NFTTitle: () => <div data-testid="nft-title">NFT Title</div>,
  NFTOwner: () => <div data-testid="nft-owner">NFT Owner</div>,
  NFTLastSoldPrice: () => (
    <div data-testid="nft-last-sold-price">NFT Last Sold Price</div>
  ),
  NFTNetwork: () => <div data-testid="nft-network">NFT Network</div>,
}));

vi.mock('./NFTCard', () => ({
  NFTCard: ({ children }: PropsWithChildren) => (
    <div data-testid="nft-card">{children}</div>
  ),
}));

describe('NFTCardDefault', () => {
  it('should render', () => {
    const { getByTestId } = render(
      <NFTCardDefault contractAddress="0x123" tokenId="1" />,
    );

    expect(getByTestId('nft-media')).toBeInTheDocument();
    expect(getByTestId('nft-title')).toBeInTheDocument();
    expect(getByTestId('nft-owner')).toBeInTheDocument();
    expect(getByTestId('nft-last-sold-price')).toBeInTheDocument();
    expect(getByTestId('nft-network')).toBeInTheDocument();
  });
});
