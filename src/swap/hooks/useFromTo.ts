import { useState } from 'react';
import type { Address } from 'viem';
import { useValue } from '../../internal/hooks/useValue';
import type { Token } from '../../token';
import type { SwapInput } from '../types';
import { useSwapBalances } from './useSwapBalances';

export const useFromTo = (
  address?: Address
): {
  from: SwapInput;
  to: SwapInput;
} => {
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
    amount: fromAmount,
    setAmount: setFromAmount,
    token: fromToken,
    setToken: setFromToken,
    loading: fromLoading,
    setLoading: setFromLoading,
    error: fromTokenBalanceError,
    refetch: async () => {
      await fromTokenResponse?.refetch();
    },
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
    refetch: async () => {
      await toTokenResponse?.refetch();
    },
  });

  return { from, to };
};
