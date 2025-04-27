import { useState } from 'react';
import type { Address } from 'viem';
import { useValue } from '../../internal/hooks/useValue';
import { useSwapBalances } from '../../swap/hooks/useSwapBalances';
import type { Token } from '../../token';
import { ethToken, usdcToken } from '../../token/constants';
import type { BuyTokens } from '../types';
import { useBuyToken } from './useBuyToken';

export const useBuyTokens = (
  toToken: Token,
  fromToken?: Token,
  address?: Address,
): BuyTokens => {
  const fromETH = useBuyToken(toToken, ethToken, address);
  const fromUSDC = useBuyToken(toToken, usdcToken, address);
  const from = useBuyToken(toToken, fromToken, address);

  const [toAmount, setToAmount] = useState('');
  const [toAmountUSD, setToAmountUSD] = useState('');
  const [toLoading, setToLoading] = useState(false);

  // If the toToken is ETH, use USDC for swapQuote
  const token = toToken?.symbol === 'ETH' ? usdcToken : ethToken;

  const {
    toBalanceString: balance,
    toTokenBalanceError: error,
    toTokenResponse: balanceResponse,
  } = useSwapBalances({ address, fromToken: token, toToken });

  const to = useValue({
    balance,
    balanceResponse,
    amount: toAmount,
    setAmount: setToAmount,
    amountUSD: toAmountUSD,
    setAmountUSD: setToAmountUSD,
    token: toToken,
    loading: toLoading,
    setLoading: setToLoading,
    error,
  });

  return { fromETH, fromUSDC, from, to };
};
