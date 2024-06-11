import { ReactElement, useState } from 'react';
import type { Token } from '@coinbase/onchainkit/token';

type SwapContainer = {
  children: (
    fromAmount: string,
    fromToken: Token,
    fromTokenBalance: string,
    setFromAmount: (a: string) => void,
    setFromToken: (t: Token) => void,
    setToToken: (t: Token) => void,
    toAmount: string,
    toToken: Token,
  ) => ReactElement;
};

const TOKEN_BALANCE_MAP: Record<string, string> = {
  ETH: '3.5',
  USDC: '2.77',
  DAI: '4.9',
};

export default function SwapContainer({ children }: SwapContainer) {
  const [toToken, setToToken] = useState<Token>();
  const [fromToken, setFromToken] = useState<Token>();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const fromTokenBalance = TOKEN_BALANCE_MAP[fromToken?.symbol];

  return children(
    fromAmount,
    fromToken,
    fromTokenBalance,
    setFromAmount,
    setFromToken,
    setToToken,
    toAmount,
    toToken,
  );
}
