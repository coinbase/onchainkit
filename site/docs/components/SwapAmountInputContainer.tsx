import type { Token } from '@coinbase/onchainkit/token';
import { type ReactElement, useState } from 'react';

type SwapAmountInputContainer = {
  children: (
    amount: string,
    setAmount: (a: string) => void,
    setToken: (t: Token) => void,
    token: Token,
    tokenBalance: string,
  ) => ReactElement;
};

const TOKEN_BALANCE_MAP: Record<string, string> = {
  ETH: '3.5',
  USDC: '2.77',
  DAI: '4.9',
};

export default function SwapAmountInputContainer({
  children,
}: SwapAmountInputContainer) {
  const [token, setToken] = useState<Token>();
  const [amount, setAmount] = useState('');

  const tokenBalance = TOKEN_BALANCE_MAP[token?.symbol];

  return children(amount, setAmount, setToken, token, tokenBalance);
}
