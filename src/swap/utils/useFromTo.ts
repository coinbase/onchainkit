import { useState } from 'react';
import { useSwapBalances } from '../hooks/useSwapBalances';
import { useValue } from '../../internal/hooks/useValue';
import type { Token } from '../../token';
import type { Address } from 'viem';

export const useFromTo = (address: Address) => {
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();
  const [toLoading, setToLoading] = useState(false);
  const [fromLoading, setFromLoading] = useState(false);

  const {
    fromBalanceString,
    fromTokenBalanceError,
    toBalanceString,
    toTokenBalanceError,
  } = useSwapBalances({ address, fromToken, toToken });

  const from = useValue({
    balance: fromBalanceString,
    amount: fromAmount,
    setAmount: setFromAmount,
    token: fromToken,
    setToken: setFromToken,
    loading: fromLoading,
    setLoading: setFromLoading,
    error: fromTokenBalanceError,
  });

  const to = useValue({
    balance: toBalanceString,
    amount: toAmount,
    setAmount: setToAmount,
    token: toToken,
    setToken: setToToken,
    loading: toLoading,
    setLoading: setToLoading,
    error: toTokenBalanceError,
  });

  return { from, to };
};
