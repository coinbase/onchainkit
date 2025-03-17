'use client';
import type { BuildSwapTransaction } from '@coinbase/onchainkit/swap';
import type { Token } from '@coinbase/onchainkit/token';
import { type ReactNode, useCallback } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

type SwapComponentsChildren = {
  address: Address | undefined;
  swappableTokens: Token[];
  onSubmit: (b: BuildSwapTransaction) => void;
};

type SwapComponentsReact = {
  children: (props: SwapComponentsChildren) => ReactNode;
};

export default function SwapComponents({ children }: SwapComponentsReact) {
  const { address } = useAccount();

  const degenToken: Token = {
    name: 'DEGEN',
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    symbol: 'DEGEN',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
    chainId: 8453,
  };

  const ethToken: Token = {
    name: 'ETH',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: 8453,
  };

  const usdcToken: Token = {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: 8453,
  };

  const wethToken: Token = {
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/47/bc/47bc3593c2dec7c846b66b7ba5f6fa6bd69ec34f8ebb931f2a43072e5aaac7a8-YmUwNmRjZDUtMjczYy00NDFiLWJhZDUtMzgwNjFmYWM0Njkx',
    chainId: 8453,
  };

  const swappableTokens = [degenToken, ethToken, usdcToken, wethToken];

  const onSubmit = useCallback(() => {}, []);

  return (
    <main className="flex flex-col">
      <div className="flex items-center space-x-4">
        {children({ address, swappableTokens, onSubmit })}
      </div>
    </main>
  );
}
