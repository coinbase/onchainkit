import { TokenChip, TokenRow, TokenSearch } from '@coinbase/onchainkit/token';
import type { Token } from '@coinbase/onchainkit/token';
import { useCallback, useState } from 'react';

const tokens: Token[] = [
  {
    name: 'Ethereum',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    blockchain: 'eth',
    chainId: 8453,
  },
  {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    blockchain: 'eth',
    chainId: 8453,
  },
  {
    name: 'Dai',
    address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    symbol: 'DAI',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/d0/d7/d0d7784975771dbbac9a22c8c0c12928cc6f658cbcf2bbbf7c909f0fa2426dec-NmU4ZWViMDItOTQyYy00Yjk5LTkzODUtNGJlZmJiMTUxOTgy',
    blockchain: 'eth',
    chainId: 8453,
  },
  {
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/47/bc/47bc3593c2dec7c846b66b7ba5f6fa6bd69ec34f8ebb931f2a43072e5aaac7a8-YmUwNmRjZDUtMjczYy00NDFiLWJhZDUtMzgwNjFmYWM0Njkx',
    blockchain: 'eth',
    chainId: 8453,
  },
];

function TokenSelector() {
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokens);

  const handleChange = useCallback((value: string) => {
    const filteredTokens = tokens.filter(({ name, symbol, address }: Token) => {
      const v = value.toLowerCase();
      return (
        name.toLowerCase().includes(v) ||
        symbol.toLowerCase().includes(v) ||
        address.toLowerCase().includes(v)
      );
    });

    setFilteredTokens(filteredTokens);
  }, []);

  const handleSelect = useCallback((token: Token) => {
    console.log('Selected token', token);
  }, []);

  return (
    <div className="flex min-w-96 flex-col gap-4 rounded-3xl bg-ock-inverse p-4">
      <TokenSearch tokens={tokens} onChange={handleChange} />
      {filteredTokens.length > 0 && (
        <div className="flex gap-2">
          {filteredTokens.map((token) => (
            <TokenChip key={token.name} token={token} onClick={handleSelect} />
          ))}
        </div>
      )}
      {filteredTokens.length > 0 ? (
        <div>
          <div className="text-black text-body dark:text-white">Tokens</div>
          <div>
            {filteredTokens.map((token) => (
              <TokenRow key={token.name} token={token} onClick={handleSelect} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-black text-body">No tokens found</div>
      )}
    </div>
  );
}

export default TokenSelector;
