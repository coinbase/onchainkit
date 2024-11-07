import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NFTMintCardDefault } from './NFTMintCardDefault';

vi.mock('./view', () => ({
  NFTMedia: () => <div data-testid="nft-media">NFT Media</div>,
}));

vi.mock('./mint', () => ({
  NFTCollectionTitle: () => (
    <div data-testid="nft-collection-title">NFT Collection Title</div>
  ),
  NFTCreator: () => <div data-testid="nft-creator">NFT Creator</div>,
  NFTMintButton: () => <div data-testid="nft-mint-button">NFT Mint Button</div>,
  NFTQuantitySelector: () => (
    <div data-testid="nft-quantity-selector">NFT Quantity Selector</div>
  ),
  NFTAssetCost: () => <div data-testid="nft-asset-cost">NFT Asset Cost</div>,
}));

vi.mock('./NFTMintCard', () => ({
  NFTMintCard: ({ children }: PropsWithChildren) => (
    <div data-testid="nft-mint-card">{children}</div>
  ),
}));

describe('NFTMintCardDefault', () => {
  it('should render', () => {
    const { getByTestId } = render(
      <NFTMintCardDefault contractAddress="0x123" tokenId="1" />,
    );

    expect(getByTestId('nft-media')).toBeInTheDocument();
    expect(getByTestId('nft-collection-title')).toBeInTheDocument();
    expect(getByTestId('nft-creator')).toBeInTheDocument();
    expect(getByTestId('nft-mint-button')).toBeInTheDocument();
    expect(getByTestId('nft-quantity-selector')).toBeInTheDocument();
    expect(getByTestId('nft-asset-cost')).toBeInTheDocument();
  });
});
