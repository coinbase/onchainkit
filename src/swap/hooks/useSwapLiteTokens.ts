import { useState } from 'react';
import type { Address } from 'viem';
import { useValue } from '../../core-react/internal/hooks/useValue';
import type { Token } from '../../token';
import { ethToken, usdcToken } from '../constants';
import type { SwapLiteTokens } from '../types';
import { useSwapBalances } from './useSwapBalances';

export const useSwapLiteTokens = (
  toToken: Token,
  fromToken?: Token,
  address?: Address,
): SwapLiteTokens => {
  const [toAmount, setToAmount] = useState('');
  const [toAmountUSD, setToAmountUSD] = useState('');
  const [toLoading, setToLoading] = useState(false);

  const [fromETHAmount, setFromETHAmount] = useState('');
  const [fromETHAmountUSD, setFromETHAmountUSD] = useState('');
  const [fromETHLoading, setFromETHLoading] = useState(false);

  const [fromUSDCAmount, setFromUSDCAmount] = useState('');
  const [fromUSDCAmountUSD, setFromUSDCAmountUSD] = useState('');
  const [fromUSDCLoading, setFromUSDCLoading] = useState(false);

  const [fromAmount, setFromAmount] = useState('');
  const [fromAmountUSD, setFromAmountUSD] = useState('');
  const [fromLoading, setFromLoading] = useState(false);

  const {
    fromBalanceString: fromETHBalanceString,
    fromTokenBalanceError: fromEthBalanceError,
    toBalanceString,
    toTokenBalanceError,
    fromTokenResponse: fromETHResponse,
    toTokenResponse,
  } = useSwapBalances({ address, fromToken: ethToken, toToken });

  const {
    fromBalanceString: fromUSDCBalanceString,
    fromTokenBalanceError: fromUSDCBalanceError,
    fromTokenResponse: fromUSDCResponse,
  } = useSwapBalances({ address, fromToken: usdcToken, toToken });

  const {
    fromBalanceString,
    fromTokenBalanceError: fromBalanceError,
    fromTokenResponse: fromResponse,
  } = useSwapBalances({ address, fromToken, toToken });

  const fromETH = useValue({
    balance: fromETHBalanceString,
    balanceResponse: fromETHResponse,
    amount: fromETHAmount,
    setAmount: setFromETHAmount,
    amountUSD: fromETHAmountUSD,
    setAmountUSD: setFromETHAmountUSD,
    token: ethToken,
    loading: fromETHLoading,
    setLoading: setFromETHLoading,
    error: fromEthBalanceError,
  });

  const fromUSDC = useValue({
    balance: fromUSDCBalanceString,
    balanceResponse: fromUSDCResponse,
    amount: fromUSDCAmount,
    setAmount: setFromUSDCAmount,
    amountUSD: fromUSDCAmountUSD,
    setAmountUSD: setFromUSDCAmountUSD,
    token: usdcToken,
    loading: fromUSDCLoading,
    setLoading: setFromUSDCLoading,
    error: fromUSDCBalanceError,
  });

  const from = useValue({
    balance: fromBalanceString,
    balanceResponse: fromResponse,
    amount: fromAmount,
    setAmount: setFromAmount,
    amountUSD: fromAmountUSD,
    setAmountUSD: setFromAmountUSD,
    token: fromToken,
    loading: fromLoading,
    setLoading: setFromLoading,
    error: fromBalanceError,
  });

  const to = useValue({
    balance: toBalanceString,
    balanceResponse: toTokenResponse,
    amount: toAmount,
    amountUSD: toAmountUSD,
    setAmountUSD: setToAmountUSD,
    setAmount: setToAmount,
    token: toToken,
    loading: toLoading,
    setLoading: setToLoading,
    error: toTokenBalanceError,
  });

  return { fromETH, from, fromUSDC, to };
};
