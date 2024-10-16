import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { NftMintProvider, useNftMintContext } from './NftMintProvider';
import { vi, describe, it, expect } from 'vitest';
import { NftProvider } from './NftProvider';
import type { NftMintData, NftData } from '../types';
import { act } from 'react';

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

vi.mock('../hooks/useNftMintData', () => ({
  useNftMintData: vi.fn(
    () =>
      ({
        price: {
          amount: 1,
          currency: 'ETH',
        },
        creatorAddress: '0xcreator',
        maxMintsPerWallet: '4',
        isEligibleToMint: true,
        totalOwners: 6,
      }) as NftMintData,
  ),
}));

const MockComponent = () => {
  const context = useNftMintContext();
  return (
    <div>
      <span data-testid="creatorAddress">{context.creatorAddress}</span>
      <span data-testid="maxMintsPerWallet">{context.maxMintsPerWallet}</span>
      <span data-testid="price">
        {context.price?.amount} {context.price?.currency}
      </span>
      <span data-testid="quantity">{context.quantity}</span>
      <button data-testid="setQuantity" type="button" onClick={() => context.setQuantity('2')}>setQuantity</button>
    </div>
  );
};

describe('NftMintProvider', () => {
  it('should provide the correct context values', () => {
    const { getByTestId } = render(
      <NftProvider contractAddress="0xcontract" tokenId="1">
        <NftMintProvider>
          <MockComponent />
        </NftMintProvider>
      </NftProvider>,
    );

    expect(getByTestId('creatorAddress').textContent).toBe('0xcreator');
    expect(getByTestId('maxMintsPerWallet').textContent).toBe('4');
    expect(getByTestId('price').textContent).toBe('1 ETH');
    expect(getByTestId('quantity').textContent).toBe('1');
  });

  it('should provide the correct context values without tokenId', () => {
    const { getByTestId } = render(
      <NftProvider contractAddress="0xcontract">
        <NftMintProvider>
          <MockComponent />
        </NftMintProvider>
      </NftProvider>,
    );

    expect(getByTestId('creatorAddress').textContent).toBe('0xcreator');
    expect(getByTestId('maxMintsPerWallet').textContent).toBe('4');
    expect(getByTestId('price').textContent).toBe('1 ETH');
    expect(getByTestId('quantity').textContent).toBe('1');
  });

  it('should throw an error when used outside of NftMintProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() =>
      render(
        <NftProvider contractAddress="0xcontract" tokenId="1">
          <MockComponent />
        </NftProvider>,
      ),
    ).toThrow('useNftMintContext must be used within an NftMint component');

    consoleError.mockRestore();
  });

  it('should update the quantity', () => {
    const { getByTestId } = render(
      <NftProvider contractAddress="0xcontract" tokenId="1">
        <NftMintProvider>
          <MockComponent />
        </NftMintProvider>
      </NftProvider>,
    );

    expect(getByTestId('quantity').textContent).toBe('1');

    act(() => {
      getByTestId('setQuantity').click();
    });

    expect(getByTestId('quantity').textContent).toBe('2');
  });
});