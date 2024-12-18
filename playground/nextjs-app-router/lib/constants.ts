import type { Token } from '@coinbase/onchainkit/token';
import type { Address } from 'viem';
import { base } from 'viem/chains';

export const deployedContracts: Record<number, { click: Address }> = {
  [8543]: {
    click: '0x7d662A03CC7f493D447EB8b499cF4533f5B640E2',
  },
  [85432]: {
    click: '0x7d662A03CC7f493D447EB8b499cF4533f5B640E2',
  },
};

export const ENVIRONMENT = {
  API_KEY: 'API_KEY',
  ENVIRONMENT: 'ENVIRONMENT',
  PROJECT_ID: 'PROJECT_ID',
  RESERVOIR_API_KEY: 'RESERVOIR_API_KEY',
} as const;

type EnvironmentKey = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];

export const ENVIRONMENT_VARIABLES: Record<EnvironmentKey, string | undefined> =
  {
    [ENVIRONMENT.API_KEY]: process.env.NEXT_PUBLIC_OCK_API_KEY,
    [ENVIRONMENT.ENVIRONMENT]: process.env.NEXT_PUBLIC_VERCEL_ENV,
    [ENVIRONMENT.PROJECT_ID]: process.env.NEXT_PUBLIC_PROJECT_ID,
    [ENVIRONMENT.RESERVOIR_API_KEY]: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
  };

export const ethToken: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: base.id,
};

export const usdcToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: base.id,
};

export const degenToken: Token = {
  name: 'DEGEN',
  address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
  symbol: 'DEGEN',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
  chainId: base.id,
};

export const daiToken: Token = {
  name: 'DAI',
  address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  symbol: 'DAI',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/92/13/9213e31b84c98a693f4c624580fdbe6e4c1cb550efbba15aa9ea68fd25ffb90c-ZTE1NmNjMGUtZGVkYi00ZDliLWI2N2QtNTY2ZWRjMmYwZmMw',
  chainId: base.id,
};
