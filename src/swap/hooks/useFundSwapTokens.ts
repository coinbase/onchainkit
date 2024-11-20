import { useState } from 'react';
import type { Address } from 'viem';
import { base } from 'viem/chains';
import { useValue } from '../../internal/hooks/useValue';
import type { Token } from '../../token';
import type { FundSwapTokens } from '../types';
import { useSwapBalances } from './useSwapBalances';

const ethToken: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: base.id,
};

const usdcToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: base.id,
};

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
