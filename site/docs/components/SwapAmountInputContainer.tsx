import { ReactElement, useState } from 'react';
import type { Token } from '@coinbase/onchainkit/token';

type SwapAmountInputContainer = {
  children: (
    token: Token,
    setToken: (t: Token) => void,
    setAmount: (a: string) => void,
    amount: string,
  ) => ReactElement;
};

export default function SwapAmountInputContainer({ children }: SwapAmountInputContainer) {
  const [token, setToken] = useState();
  const [amount, setAmount] = useState('');

  return children(token, setToken, setAmount, amount);
}
