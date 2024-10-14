import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { NftProvider, useNftContext } from './NftProvider';
import { vi, describe, it, expect } from 'vitest';
import type { NftData } from '../types';

vi.mock('../hooks/useNftData', () => ({
  useNftData: vi.fn(
    () =>
      ({
        name: 'Test NFT',
        description: 'This is a test NFT',
        imageUrl: 'http://example.com/test-nft.png',
      }) as NftData,
  ),
}));

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
      <NftProvider contractAddress="0x123" tokenId="1">
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

  it('should use the default useNftData hook if not provided', () => {
    const { getByText } = render(
      <NftProvider contractAddress="0x123" tokenId="1">
        <MockComponent />
      </NftProvider>,
    );

    expect(getByText('Test NFT')).toBeInTheDocument();
  });

  it('should use a custom useNftData hook if provided', () => {
    const customUseNftData = vi.fn(
      () =>
        ({
          name: 'Custom NFT',
          description: 'This is a custom NFT',
          imageUrl: 'http://example.com/custom-nft.png',
        }) as NftData,
    );

    const { getByText, getByAltText } = render(
      <NftProvider
        contractAddress="0x123"
        tokenId="1"
        useNftData={customUseNftData}
      >
        <MockComponent />
      </NftProvider>,
    );

    expect(getByText('Custom NFT')).toBeInTheDocument();
    expect(getByText('This is a custom NFT')).toBeInTheDocument();
    expect(getByAltText('Custom NFT')).toHaveAttribute(
      'src',
      'http://example.com/custom-nft.png',
    );
  });
});
