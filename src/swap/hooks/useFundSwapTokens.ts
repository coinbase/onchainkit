import { useState } from 'react';
import type { Address } from 'viem';
import { ethToken, usdcToken } from '../constants';
import { useValue } from '../../internal/hooks/useValue';
import type { Token } from '../../token';
import type { FundSwapTokens } from '../types';
import { useSwapBalances } from './useSwapBalances';

export const useFundSwapTokens = (
  toToken: Token,
  address?: Address,
): FundSwapTokens => {
  const [toAmount, setToAmount] = useState('');
  const [toAmountUSD, setToAmountUSD] = useState('');
  const [toLoading, setToLoading] = useState(false);
  const [fromETHAmount, setFromETHAmount] = useState('');
  const [fromETHAmountUSD, setFromETHAmountUSD] = useState('');
  const [fromETHLoading, setFromETHLoading] = useState(false);
  const [fromUSDCAmount, setFromUSDCAmount] = useState('');
  const [fromUSDCAmountUSD, setFromUSDCAmountUSD] = useState('');
  const [fromUSDCLoading, setFromUSDCLoading] = useState(false);

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

  return { fromETH, fromUSDC, to };
};
