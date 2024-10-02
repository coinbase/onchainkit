import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { NftData } from '../types';
import { NftProvider, useNftContext } from './NftProvider';

const useNftData = vi.fn(
  () =>
    ({
      name: 'Test NFT',
      description: 'This is a test NFT',
      imageUrl: 'http://example.com/test-nft.png',
    }) as NftData,
);

const MockComponent = () => {
  const context = useNftContext();
  return (
    <div>
      <p>{context.name}</p>
      <p>{context.description}</p>
      <img src={context.imageUrl} alt={context.name} />
    </div>
  );
};

describe('NftProvider', () => {
  it('should provide NFT data to its children', () => {
    const { getByText, getByAltText } = render(
      <NftProvider contractAddress="0x123" tokenId="1" useNftData={useNftData}>
        <MockComponent />
      </NftProvider>,
    );

    expect(getByText('Test NFT')).toBeInTheDocument();
    expect(getByText('This is a test NFT')).toBeInTheDocument();
    expect(getByAltText('Test NFT')).toHaveAttribute(
      'src',
      'http://example.com/test-nft.png',
    );
  });

  it('should throw an error when useNftContext is used outside of NftProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<MockComponent />)).toThrow(
      'useNftContext must be used within an NftView or NftMint component',
    );

    consoleError.mockRestore();
  });
});
