import { Children, useCallback, useEffect, useMemo, useState } from 'react';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapButton } from './SwapButton';
import { SwapToggleButton } from './SwapToggleButton';
import { SwapMessage } from './SwapMessage';
import { SwapContext } from '../context';
import { getSwapQuote } from '../core/getSwapQuote';
import { isETHBalanceResponse, isSwapError } from '../core/isSwapError';
import { TextTitle3 } from '../../internal/text';
import { formatTokenAmount } from '../../utils/formatTokenAmount';
import { useBalance, useReadContract } from 'wagmi';
import { erc20Abi, Address } from 'viem';
import type { SwapError, SwapLoadingState, SwapReact } from '../types';
import type { Token } from '../../token';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';
import { getSwapState } from '../core/getSwapState';
import { getTokenBalances } from '../core/getTokenBalances';

export function Swap({ address, children, title = 'Swap' }: SwapReact) {
  const [error, setError] = useState<SwapError>();
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();
  const [isLoading, setIsLoading] = useState<SwapLoadingState>({
    isFromTokenBalanceLoading: false,
    isToTokenBalanceLoading: false,
  });

  // returns ETH balance
  const ethBalanceResponse: UseBalanceReturnType = useBalance({
    address,
  });

  // returns erc20 token balance
  const fromTokenBalanceResponse: UseReadContractReturnType = useReadContract({
    abi: erc20Abi,
    address: fromToken?.address as Address,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!fromToken?.address && !!address,
    },
  });

  // returns erc20 token balance
  const toTokenBalanceResponse: UseReadContractReturnType = useReadContract({
    abi: erc20Abi,
    address: toToken?.address as Address,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!toToken?.address && !!address,
    },
  });

  const tokenBalanceResponses = useMemo(() => {
    const fromTokenBalance = fromToken?.address
      ? fromTokenBalanceResponse
      : ethBalanceResponse;
    const toTokenBalance = toToken?.address
      ? toTokenBalanceResponse
      : ethBalanceResponse;

    return {
      fromTokenBalance,
      toTokenBalance,
    };
  }, [
    fromToken,
    ethBalanceResponse,
    fromTokenBalanceResponse,
    toToken,
    toTokenBalanceResponse,
  ]);

  const {
    convertedFromTokenBalance,
    roundedFromTokenBalance,
    convertedToTokenBalance,
    roundedToTokenBalance,
  } = useMemo(() => {
    const {
      convertedBalance: convertedFromTokenBalance,
      roundedBalance: roundedFromTokenBalance,
    } = getTokenBalances({
      token: fromToken,
      ethBalance: ethBalanceResponse?.data?.value,
      tokenBalance: fromTokenBalanceResponse?.data as bigint,
    });
    const {
      convertedBalance: convertedToTokenBalance,
      roundedBalance: roundedToTokenBalance,
    } = getTokenBalances({
      token: toToken,
      ethBalance: ethBalanceResponse?.data?.value,
      tokenBalance: toTokenBalanceResponse?.data as bigint,
    });

    return {
      convertedFromTokenBalance,
      convertedToTokenBalance,
      roundedFromTokenBalance,
      roundedToTokenBalance,
    };
  }, [
    ethBalanceResponse?.data,
    fromToken,
    fromTokenBalanceResponse?.data,
    toToken,
    toTokenBalanceResponse?.data,
  ]);

  const swapLoadingState = useMemo(() => {
    return getSwapState({
      fromTokenBalanceResponse: tokenBalanceResponses?.fromTokenBalance,
      toTokenBalanceResponse: tokenBalanceResponses?.toTokenBalance,
    });
  }, [
    fromToken,
    fromTokenBalanceResponse,
    ethBalanceResponse,
    toToken,
    toTokenBalanceResponse,
  ]);

  /* istanbul ignore next */
  const handleFromAmountChange = useCallback(
    async (amount: string) => {
      const hasRequiredFields = fromToken && toToken && amount;
      if (!hasRequiredFields) {
        return;
      }
      try {
        const response = await getSwapQuote({
          from: fromToken,
          to: toToken,
          amount,
          amountReference: 'from',
        });
        if (isSwapError(response)) {
          setError(response);
          return;
        }
        const formattedAmount = formatTokenAmount(
          response?.toAmount,
          response?.to?.decimals,
        );
        setToAmount(formattedAmount);
      } catch (err) {
        setError(err as SwapError);
      }
    },
    [fromToken, toToken],
  );

  /* istanbul ignore next */
  const handleToAmountChange = useCallback(
    async (amount: string) => {
      const hasRequiredFields = fromToken && toToken && amount;
      if (!hasRequiredFields) {
        return;
      }
      try {
        const response = await getSwapQuote({
          from: fromToken,
          to: toToken,
          amount,
          amountReference: 'to',
        });
        if (isSwapError(response)) {
          setError(response);
          return;
        }
        const formattedAmount = formatTokenAmount(
          response.fromAmount,
          response?.from?.decimals,
        );
        setFromAmount(formattedAmount);
      } catch (err) {
        setError(err as SwapError);
      }
    },
    [fromToken, toToken],
  );

  /* istanbul ignore next */
  const handleToggle = useCallback(() => {
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setToToken(fromToken);
    setFromToken(toToken);
  }, [fromAmount, fromToken, toAmount, toToken]);

  const value = useMemo(() => {
    return {
      address,
      convertedFromTokenBalance,
      convertedToTokenBalance,
      error,
      fromAmount,
      fromToken,
      handleFromAmountChange,
      handleToAmountChange,
      handleToggle,
      roundedFromTokenBalance,
      roundedToTokenBalance,
      setError,
      setFromAmount,
      setFromToken,
      setToToken,
      setToAmount,
      swapLoadingState,
      toAmount,
      toToken,
    };
  }, [
    address,
    convertedFromTokenBalance,
    convertedToTokenBalance,
    error,
    fromAmount,
    fromToken,
    handleFromAmountChange,
    handleToAmountChange,
    handleToggle,
    setError,
    setFromAmount,
    setFromToken,
    setToToken,
    setToAmount,
    swapLoadingState,
    toAmount,
    toToken,
  ]);

  const { inputs, toggleButton, swapButton, swapMessage } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      // @ts-ignore
      inputs: childrenArray.filter(({ type }) => type === SwapAmountInput),
      // @ts-ignore
      toggleButton: childrenArray.find(({ type }) => type === SwapToggleButton),
      // @ts-ignore
      swapButton: childrenArray.find(({ type }) => type === SwapButton),
      // @ts-ignore
      swapMessage: childrenArray.find(({ type }) => type === SwapMessage),
    };
  }, [children]);

  return (
    <SwapContext.Provider value={value}>
      <div className="flex w-[500px] flex-col rounded-xl bg-gray-100 px-6 pt-6 pb-4">
        <div className="mb-4">
          <TextTitle3 data-testid="ockSwap_Title" className="font-bold">
            {title}
          </TextTitle3>
        </div>
        {inputs[0]}
        <div className="relative h-1">{toggleButton}</div>
        {inputs[1]}
        {swapButton}
        {swapMessage}
      </div>
    </SwapContext.Provider>
  );
}
