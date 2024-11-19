import { useState } from 'react';
import type { Address } from 'viem';
import { useValue } from '../../internal/hooks/useValue';
import type { Token } from '../../token';
import type { FromTo } from '../types';
import { useSwapBalances } from './useSwapBalances';
import { useAccount } from 'wagmi';
import { base } from 'viem/chains';

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

export const useFromTo = (address?: Address): FromTo => {
  const { chainId } = useAccount();

  const [fromAmount, setFromAmount] = useState('');
  const [fromAmountUSD, setFromAmountUSD] = useState('');
  const [fromETHToken, setFromETHToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toAmountUSD, setToAmountUSD] = useState('');
  const [toToken, setToToken] = useState<Token>();
  const [toLoading, setToLoading] = useState(false);
  const [fromLoading, setFromLoading] = useState(false);

  const {
    fromBalanceString: fromETHBalanceString,
    fromTokenBalanceError: fromEthBalanceError,
    toBalanceString,
    toTokenBalanceError,
    fromTokenResponse: fromETHResponse,
    toTokenResponse,
  } = useSwapBalances({ address, fromToken: fromETHToken, toToken });

  const fromETH = useValue({
    balance: fromETHBalanceString,
    balanceResponse: fromETHResponse,
    amount: fromAmount,
    setAmount: setFromAmount,
    amountUSD: fromAmountUSD,
    setAmountUSD: setFromAmountUSD,
    token: ethToken,
    setToken: setFromETHToken,
    loading: fromLoading,
    setLoading: setFromLoading,
    error: fromEthBalanceError,
  });

  const to = useValue({
    balance: toBalanceString,
    balanceResponse: toTokenResponse,
    amount: toAmount,
    amountUSD: toAmountUSD,
    setAmountUSD: setToAmountUSD,
    setAmount: setToAmount,
    token: toToken,
    setToken: setToToken,
    loading: toLoading,
    setLoading: setToLoading,
    error: toTokenBalanceError,
  });

  return { fromETH, to };
};
