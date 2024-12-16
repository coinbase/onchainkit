import { useState } from 'react';
import type { Address } from 'viem';
import { useValue } from '../../core-react/internal/hooks/useValue';
import type { Token } from '../../token';
import { useSwapBalances } from './useSwapBalances';

export const useSwapLiteToken = (
  toToken: Token,
  token: Token | undefined,
  address: Address | undefined,
) => {
  const [amount, setAmount] = useState('');
  const [amountUSD, setAmountUSD] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    fromBalanceString: balance,
    fromTokenBalanceError: error,
    fromTokenResponse: balanceResponse,
  } = useSwapBalances({ address, fromToken: token, toToken });

  return useValue({
    balance,
    balanceResponse,
    amount,
    setAmount,
    amountUSD,
    setAmountUSD,
    token,
    loading,
    setLoading,
    error,
  });
};
