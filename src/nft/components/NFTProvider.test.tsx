import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { NFTData } from '../types';
import { NFTProvider, useNFTContext } from './NFTProvider';

const useNFTData = vi.fn(
  () =>
    ({
      name: 'Test NFT',
      description: 'This is a test NFT',
      imageUrl: 'http://example.com/test-nft.png',
    }) as NFTData,
);

const MockComponent = () => {
  const context = useNFTContext();
  return (
    <div>
      <p>{context.name}</p>
      <p>{context.description}</p>
      <img src={context.imageUrl} alt={context.name} />
    </div>
  );
};

describe('NFTProvider', () => {
  it('should provide NFT data to its children', () => {
    const { getByText, getByAltText } = render(
      <NFTProvider contractAddress="0x123" tokenId="1" useNFTData={useNFTData}>
        <MockComponent />
      </NFTProvider>,
    );

    expect(getByText('Test NFT')).toBeInTheDocument();
    expect(getByText('This is a test NFT')).toBeInTheDocument();
    expect(getByAltText('Test NFT')).toHaveAttribute(
      'src',
      'http://example.com/test-nft.png',
    );
  });

  it('should throw an error when useNFTContext is used outside of NFTProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<MockComponent />)).toThrow(
      'useNFTContext must be used within an NFTView or NFTMint component',
    );

    consoleError.mockRestore();
  });
});
