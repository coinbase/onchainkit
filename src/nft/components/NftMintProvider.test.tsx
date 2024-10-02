import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { NftMintProvider, useNftMintContext } from './NftMintProvider';
import { useAccount, useChainId } from 'wagmi';
import { useTrendingMint } from '../hooks/useTrendingMint';
import { useAggregatedCollectionDetails } from '../hooks/useAggregatedCollectionDetails';
import { type Mock, vi, describe, beforeEach, it, expect } from 'vitest';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useChainId: vi.fn(),
}));

vi.mock('../hooks/useTrendingMint', () => ({
  useTrendingMint: vi.fn(),
}));

vi.mock('../hooks/useAggregatedCollectionDetails', () => ({
  useAggregatedCollectionDetails: vi.fn(),
}));

const MockComponent = () => {
  const context = useNftMintContext();
  return (
    <div>
      <span data-testid="contractAddress">{context.contractAddress}</span>
      <span data-testid="tokenId">{context.tokenId}</span>
      <span data-testid="price">{context.price?.amount?.decimal}</span>
    </div>
  );
};

describe('NftMintProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2024-01-01'));
    (useAccount as Mock).mockReturnValue({ address: '0x123' });
    (useChainId as Mock).mockReturnValue(1);
    (useTrendingMint as Mock).mockReturnValue({
      data: {
        collection: {
          stages: [
            {
              tokenId: '1',
              stage: 'public-sale',
              price: {
                amount: {
                  decimal: 0.05,
                },
                currency: {
                  symbol: 'ETH',
                },
                maxMintsPerWallet: 5,
              },
            },
          ],
          network: 'mainnet',
          isMinting: true,
          creatorAddress: '0xcreator',
        },
        takerEligibility: {
          eligibleForCollection: true,
        },
      },
    });
    (useAggregatedCollectionDetails as Mock).mockReturnValue({
      data: {
        totalTokens: 100,
        totalOwners: 10,
      },
    });
  });

  it('should provide the correct context values', () => {
    const { getByTestId } = render(
      <NftMintProvider contractAddress="0xcontract" tokenId="1">
        <MockComponent />
      </NftMintProvider>,
    );

    expect(getByTestId('contractAddress').textContent).toBe('0xcontract');
    expect(getByTestId('tokenId').textContent).toBe('1');
  });

  it('should throw an error when used outside of NftMintProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<MockComponent />)).toThrow(
      'useNftMintContext must be used within an NftMint component',
    );

    consoleError.mockRestore();
  });

  it('should return the first unexpired public-sale price', () => {
    const { getByTestId } = render(
      <NftMintProvider contractAddress="0xcontract" tokenId="1">
        <MockComponent />
      </NftMintProvider>,
    );

    expect(getByTestId('price').textContent).toBe('0.05');
  });

  it('should return a price that has an undefined endTime', () => {
    (useTrendingMint as Mock).mockReturnValue({
      data: {
        collection: {
          stages: [
            {
              stage: 'public-sale',
              endTime: undefined,
              price: {
                amount: {
                  decimal: 0.05,
                },
                currency: {
                  symbol: 'ETH',
                },
                maxMintsPerWallet: 5,
              },
            },
          ],
          network: 'mainnet',
          isMinting: true,
          creatorAddress: '0xcreator',
        },
        takerEligibility: {
          eligibleForCollection: true,
        },
      },
    });
    const { getByTestId } = render(
      <NftMintProvider contractAddress="0xcontract" tokenId="1">
        <MockComponent />
      </NftMintProvider>,
    );

    expect(getByTestId('price').textContent).toBe('0.05');
  });

  it('should return a price that is not expired', () => {
    (useTrendingMint as Mock).mockReturnValue({
      data: {
        collection: {
          stages: [
            {
              stage: 'public-sale',
              endTime: 1735707600000,
              price: {
                amount: {
                  decimal: 0.05,
                },
                currency: {
                  symbol: 'ETH',
                },
                maxMintsPerWallet: 5,
              },
            },
          ],
          network: 'mainnet',
          isMinting: true,
          creatorAddress: '0xcreator',
        },
        takerEligibility: {
          eligibleForCollection: true,
        },
      },
    });
    const { getByTestId } = render(
      <NftMintProvider contractAddress="0xcontract" tokenId="1">
        <MockComponent />
      </NftMintProvider>,
    );

    expect(getByTestId('price').textContent).toBe('0.05');
  });
});
