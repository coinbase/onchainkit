import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { NFTData, NFTMintData } from '../types';
import { NFTMintProvider, useNFTMintContext } from './NFTMintProvider';
import { NFTProvider } from './NFTProvider';

const useNFTData = vi.fn(
  () =>
    ({
      name: 'Test NFT',
      description: 'This is a test NFT',
      imageUrl: 'http://example.com/test-nft.png',
    }) as NFTData,
);

const useNFTMintData = vi.fn(
  () =>
    ({
      price: {
        amount: 1,
        currency: 'ETH',
      },
      creatorAddress: '0xcreator',
      maxMintsPerWallet: 4,
      isEligibleToMint: true,
      totalOwners: 6,
    }) as NFTMintData,
);

const MockComponent = () => {
  const context = useNFTMintContext();
  return (
    <div>
      <span data-testid="creatorAddress">{context.creatorAddress}</span>
      <span data-testid="maxMintsPerWallet">{context.maxMintsPerWallet}</span>
      <span data-testid="price">
        {context.price?.amount} {context.price?.currency}
      </span>
      <span data-testid="quantity">{context.quantity}</span>
      <button
        data-testid="setQuantity"
        type="button"
        onClick={() => context.setQuantity('2')}
      >
        setQuantity
      </button>
    </div>
  );
};

describe('NFTMintProvider', () => {
  it('should provide the correct context values', () => {
    const { getByTestId } = render(
      <NFTProvider
        contractAddress="0xcontract"
        tokenId="1"
        useNFTData={useNFTData}
      >
        <NFTMintProvider useNFTMintData={useNFTMintData}>
          <MockComponent />
        </NFTMintProvider>
      </NFTProvider>,
    );

    expect(getByTestId('creatorAddress').textContent).toBe('0xcreator');
    expect(getByTestId('maxMintsPerWallet').textContent).toBe('4');
    expect(getByTestId('price').textContent).toBe('1 ETH');
    expect(getByTestId('quantity').textContent).toBe('1');
  });

  it('should provide the correct context values without tokenId', () => {
    const { getByTestId } = render(
      <NFTProvider contractAddress="0xcontract" useNFTData={useNFTData}>
        <NFTMintProvider useNFTMintData={useNFTMintData}>
          <MockComponent />
        </NFTMintProvider>
      </NFTProvider>,
    );

    expect(getByTestId('creatorAddress').textContent).toBe('0xcreator');
    expect(getByTestId('maxMintsPerWallet').textContent).toBe('4');
    expect(getByTestId('price').textContent).toBe('1 ETH');
    expect(getByTestId('quantity').textContent).toBe('1');
  });

  it('should throw an error when used outside of NFTMintProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() =>
      render(
        <NFTProvider
          contractAddress="0xcontract"
          tokenId="1"
          useNFTData={useNFTData}
        >
          <MockComponent />
        </NFTProvider>,
      ),
    ).toThrow('useNFTMintContext must be used within an NFTMint component');

    consoleError.mockRestore();
  });

  it('should update the quantity', () => {
    const { getByTestId } = render(
      <NFTProvider
        contractAddress="0xcontract"
        tokenId="1"
        useNFTData={useNFTData}
      >
        <NFTMintProvider useNFTMintData={useNFTMintData}>
          <MockComponent />
        </NFTMintProvider>
      </NFTProvider>,
    );

    expect(getByTestId('quantity').textContent).toBe('1');

    act(() => {
      getByTestId('setQuantity').click();
    });

    expect(getByTestId('quantity').textContent).toBe('2');
  });
});
