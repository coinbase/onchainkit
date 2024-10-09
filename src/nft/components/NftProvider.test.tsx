import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { NftProvider, useNftContext } from './NftProvider';
import { NftContextType } from '../types';
import { useChainId } from 'wagmi';
import { useTokenDetails } from '../hooks/useTokenDetails';
import { useMetadata } from '../hooks/useMetadata';
import { type Mock, vi, describe, beforeEach, it, expect } from 'vitest';

vi.mock('wagmi', () => ({
  useChainId: vi.fn(),
}));

vi.mock('../hooks/useTokenDetails', () => ({
  useTokenDetails: vi.fn(),
}));

vi.mock('../hooks/useMetadata', () => ({
  useMetadata: vi.fn(),
}));

const mockUseChainId = useChainId as Mock;
const mockUseTokenDetails = useTokenDetails as Mock;
const mockUseMetadata = useMetadata as Mock;

const TestComponent = () => {
  const context = useNftContext();
  return (
    <div>
      <p>{context.name}</p>
      <p>{context.description}</p>
      <p>{context.animationUrl}</p>
      <p>{context.imageUrl}</p>
      <p>{context.mimeType}</p>
    </div>
  );
};

describe('NftProvider', () => {
  beforeEach(() => {
    mockUseChainId.mockReturnValue(1);
    mockUseTokenDetails.mockReturnValue({
      data: {
        name: 'Test NFT',
        description: 'Test Description',
        imageUrl: 'http://example.com/image.png',
        ownerAddress: '0x1234567890abcdef',
        lastSoldPrice: '1 ETH',
        paymentCurrency: 'ETH',
        tokenType: 'ERC721',
        cachedImageUrl: {
          mimeType: 'image/gif',
        },
      },
    });
    mockUseMetadata.mockReturnValue({
      data: {
        name: 'Test NFT Metadata',
        description: 'Test Metadata Description',
        image: 'http://example.com/metadata-image.png',
      },
    });
  });

  it('should set the correct context values', () => {
    const { getByText } = render(
      <NftProvider contractAddress="0x123" tokenId="1">
        <TestComponent />
      </NftProvider>,
    );

    expect(getByText('Test NFT')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
    expect(getByText('http://example.com/image.png')).toBeInTheDocument();
    expect(getByText('image/gif')).toBeInTheDocument();
  });

  it('should use fallbacks if initial values are undefined', () => {
    mockUseTokenDetails.mockReturnValue({
      data: {
        name: 'Test NFT',
        description: 'Test Description',
        cachedImageUrl: {
          originalUrl: 'http://example.com/image.png',
          mimeType: 'image/gif',
        },
        ownerAddress: '0x1234567890abcdef',
        lastSoldPrice: '1 ETH',
        paymentCurrency: 'ETH',
        tokenType: 'ERC721',
      },
    });

    const { getByText } = render(
      <NftProvider contractAddress="0x123" tokenId="1">
        <TestComponent />
      </NftProvider>,
    );

    expect(getByText('Test NFT')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
    expect(getByText('http://example.com/image.png')).toBeInTheDocument();
    expect(getByText('image/gif')).toBeInTheDocument();
  });

  it('should set the correct animation values', () => {
    mockUseTokenDetails.mockReturnValue({
      data: {
        name: 'Test NFT',
        description: 'Test Description',
        cachedAnimationUrl: {
          originalUrl: 'http://example.com/image.mov',
          mimeType: 'video/mov',
        },
        ownerAddress: '0x1234567890abcdef',
        lastSoldPrice: '1 ETH',
        paymentCurrency: 'ETH',
        tokenType: 'ERC721',
      },
    });

    const { getByText } = render(
      <NftProvider contractAddress="0x123" tokenId="1">
        <TestComponent />
      </NftProvider>,
    );

    expect(getByText('Test NFT')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
    expect(getByText('http://example.com/image.mov')).toBeInTheDocument();
    expect(getByText('video/mov')).toBeInTheDocument();
  });

  it('should throw an error when used outside of NftProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useNftContext must be used within a NftView component',
    );

    consoleError.mockRestore();
  });
});

/*
    imageUrl:
      tokenDetails?.imageUrl || tokenDetails?.cachedImageUrl?.originalUrl,
    animationUrl:
      tokenDetails?.animationUrl ||
      tokenDetails?.cachedAnimationUrl?.originalUrl,
    mimeType:
      tokenDetails?.cachedAnimationUrl?.mimeType ||
      tokenDetails?.cachedImageUrl?.mimeType,

*/
