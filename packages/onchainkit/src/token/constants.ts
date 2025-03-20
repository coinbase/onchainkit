import { base, baseSepolia } from 'viem/chains';
import type { Token } from './types';

export const ethToken: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: base.id,
};

export const ethSepoliaToken: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: baseSepolia.id,
};

export const usdcToken: Token = {
  name: 'USDC',
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: base.id,
};

export const usdcSepoliaToken: Token = {
  name: 'USDC',
  address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: baseSepolia.id,
};

export const degenToken: Token = {
  name: 'DEGEN',
  address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
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

const wethToken: Token = {
  name: 'WETH',
  address: '0x4200000000000000000000000000000000000006',
  symbol: 'WETH',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/47/bc/47bc3593c2dec7c846b66b7ba5f6fa6bd69ec34f8ebb931f2a43072e5aaac7a8-YmUwNmRjZDUtMjczYy00NDFiLWJhZDUtMzgwNjFmYWM0Njkx',
  chainId: base.id,
};

const lbtcToken: Token = {
  name: 'LBTC',
  address: '0xecAc9C5F704e954931349Da37F60E39f515c11c1',
  symbol: 'LBTC',
  decimals: 8,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/a3/40/a340085995bc54eddbcb66bab87833a7089edd1513847c39fc1799cab9207db4-Zjk2YzQ2MmQtMTY2OS00YWQyLWFkMGQtMjQ3OGYzNzljMWY2',
  chainId: base.id,
};

const cbbtcToken: Token = {
  name: 'cbBTC',
  address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
  symbol: 'cbBTC',
  decimals: 8,
  image: 'https://go.wallet.coinbase.com/static/CBBTCMedium.png',
  chainId: base.id,
};

const eUsdToken: Token = {
  name: 'eUSD',
  address: '0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4',
  symbol: 'eUSD',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/bf/a4/bfa445583916854508ae5d88f9cca19cd5a0910d8c4d7cd9385eb40a597017d7-MDFhM2E0YmQtZGU3NS00Yzk3LWFlMzAtMzA1Y2UyYzU2ZGEy',
  chainId: base.id,
};
const eurcToken: Token = {
  name: 'EURC',
  address: '0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42',
  symbol: 'EURC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/54/f4/54f4216472dd25b1ffb5caf32cc0d81f645c84be166cd713f759a80f05a1418f-M2YxNTczYTItNjk3YS00N2FiLThkZjktYzBiYzExZTk1ZTFj',
  chainId: base.id,
};

const baseTokens = [
  ethToken,
  wethToken,
  usdcToken,
  degenToken,
  daiToken,
  lbtcToken,
  cbbtcToken,
  eUsdToken,
  eurcToken,
] as const;

export { baseTokens };
