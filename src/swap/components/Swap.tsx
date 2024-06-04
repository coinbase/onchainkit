import { useCallback, useState } from 'react';
import { AmountInput } from './AmountInput';

import { SwapTokensButton } from './SwapTokensButton';
import { Token } from '../../token';

// TODO: replace with actual tokens
const tokens: Token[] = [
  {
    name: 'ETH',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'ETH',
    decimals: 18,
    image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: 8453,
  },
  {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: 8453,
  },
  {
    name: 'Dai',
    address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    symbol: 'DAI',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/d0/d7/d0d7784975771dbbac9a22c8c0c12928cc6f658cbcf2bbbf7c909f0fa2426dec-NmU4ZWViMDItOTQyYy00Yjk5LTkzODUtNGJlZmJiMTUxOTgy',
    chainId: 8453,
  },
  {
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/47/bc/47bc3593c2dec7c846b66b7ba5f6fa6bd69ec34f8ebb931f2a43072e5aaac7a8-YmUwNmRjZDUtMjczYy00NDFiLWJhZDUtMzgwNjFmYWM0Njkx',
    chainId: 8453,
  },
];

export function Swap() {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>(tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[1]);

  const handleSwapTokensClick = useCallback(() => {
    const prevFromToken = fromToken;
    setFromToken(toToken);
    setToToken(prevFromToken);
  }, [fromToken, toToken]);

  const handleSelectTokenClick = useCallback(() => {
    // TODO: open select token modal
  }, [fromToken, toToken]);

  // TODO: update with actual estimate
  const estimatedAmountInFiat = fromAmount;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '31.25rem',
        gap: '1rem',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: '500',
        }}
      >
        <label style={{ fontSize: '1.25rem', color: 'black' }}>Swap</label>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          position: 'relative',
        }}
      >
        <AmountInput
          label="You pay"
          amount={fromAmount}
          setAmount={setFromAmount}
          selectedToken={fromToken}
          estimatedAmountInFiat={estimatedAmountInFiat}
          selectTokenClick={handleSelectTokenClick}
        />
        <SwapTokensButton onClick={handleSwapTokensClick} />
        <AmountInput
          label="You receive"
          amount={toAmount}
          setAmount={setToAmount}
          disabled={true}
          selectedToken={toToken}
          selectTokenClick={handleSelectTokenClick}
        />
      </div>
      <div
        style={{
          background: '#0052FF',
          width: '100%',
          borderRadius: '6.25rem',
          color: 'white',
          padding: '1rem 2rem',
          fontWeight: '500',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        Swap
      </div>
    </div>
  );
}
