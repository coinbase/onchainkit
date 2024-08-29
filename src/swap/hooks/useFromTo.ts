import { useState } from 'react';
import type { Address } from 'viem';
import { useValue } from '../../internal/hooks/useValue';
import type { Token } from '../../token';
import type { FromTo } from '../types';
import { useSwapBalances } from './useSwapBalances';

export const useFromTo = (address?: Address): FromTo => {
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
    fromTokenResponse,
    toTokenResponse,
  } = useSwapBalances({ address, fromToken, toToken });

  const from = useValue({
    balance: fromBalanceString,
    balanceResponse: fromTokenResponse,
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
    balanceResponse: toTokenResponse,
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
