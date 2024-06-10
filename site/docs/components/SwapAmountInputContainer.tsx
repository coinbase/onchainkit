import { ReactElement, useState } from 'react';
import type { Token } from '@coinbase/onchainkit/token';

type SwapAmountInputContainer = {
  children: (
    token: Token,
    setToken: (t: Token) => void,
    setAmount: (a: string) => void,
    amount: string,
    tokenBalance: string,
    onMaxButtonClick: () => void,
  ) => ReactElement;
};

const TOKEN_BALANCE_MAP: Record<string, string> = {
  ETH: '3.5',
  USDC: '2.77',
  DAI: '4.9',
};

export default function SwapAmountInputContainer({ children }: SwapAmountInputContainer) {
  const [token, setToken] = useState<Token>();
  const [amount, setAmount] = useState('');

  const tokenBalance = TOKEN_BALANCE_MAP[token?.symbol];

  const onMaxButtonClick = () => {
    setAmount(tokenBalance);
  };

  return children(token, setToken, setAmount, amount, tokenBalance, onMaxButtonClick);
}
