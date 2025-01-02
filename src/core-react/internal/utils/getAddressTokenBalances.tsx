// import type { Address } from 'viem';
// import { base } from 'viem/chains';
// import { sendRequest } from '../../network/request';
import type { Token } from '@/token';

export type TokenBalanceWithFiatValue = {
  token: Token;
  /** Token:
   * address: Address | "";
   * chainId: number;
   * decimals: number;
   * image: string | null;
   * name: string;
   * symbol: string;
   */
  balance: number;
  valueInFiat: number;
};

export async function getAddressTokenBalances(
  address: `0x${string}`,
): Promise<TokenBalanceWithFiatValue[]> {
  if (!address || address.slice(0, 2) !== '0x' || address.length !== 42) {
    return [];
  }

  const tokenBalances: TokenBalanceWithFiatValue[] = [
    {
      token: {
        name: 'Ether',
        address: '',
        symbol: 'ETH',
        decimals: 18,
        image:
          'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
        chainId: 8453,
      },
      balance: 0.42,
      valueInFiat: 1386,
    },
    {
      token: {
        name: 'USD Coin',
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        symbol: 'USDC',
        decimals: 6,
        image:
          'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
        chainId: 8453,
      },
      balance: 69,
      valueInFiat: 69,
    },
    {
      token: {
        name: 'Ether',
        address: '',
        symbol: 'ETH',
        decimals: 18,
        image:
          'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
        chainId: 8453,
      },
      balance: 0.42,
      valueInFiat: 1386,
    },
    {
      token: {
        name: 'USD Coin',
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        symbol: 'USDC',
        decimals: 6,
        image:
          'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
        chainId: 8453,
      },
      balance: 69,
      valueInFiat: 69,
    },
    {
      token: {
        name: 'Ether',
        address: '',
        symbol: 'ETH',
        decimals: 18,
        image:
          'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
        chainId: 8453,
      },
      balance: 0.42,
      valueInFiat: 1386,
    },
    {
      token: {
        name: 'USD Coin',
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        symbol: 'USDC',
        decimals: 6,
        image:
          'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
        chainId: 8453,
      },
      balance: 69,
      valueInFiat: 69,
    },
    {
      token: {
        name: 'Ether',
        address: '',
        symbol: 'ETH',
        decimals: 18,
        image:
          'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
        chainId: 8453,
      },
      balance: 0.42,
      valueInFiat: 1386,
    },
    {
      token: {
        name: 'USD Coin',
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        symbol: 'USDC',
        decimals: 6,
        image:
          'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
        chainId: 8453,
      },
      balance: 69,
      valueInFiat: 69,
    },
  ];

  return tokenBalances.sort((a, b) => b.valueInFiat - a.valueInFiat);
}
