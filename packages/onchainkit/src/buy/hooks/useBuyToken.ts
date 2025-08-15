import { useState } from 'react';
import type { Address } from 'viem';
import { useSwapBalances } from '../../swap/hooks/useSwapBalances';
import type { Token } from '../../token';

export const useBuyToken = (
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

  return {
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
  };
};
