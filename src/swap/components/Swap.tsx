import { Children, useCallback, useMemo, useState } from 'react';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapButton } from './SwapButton';
import { SwapToggleButton } from './SwapToggleButton';
import { SwapMessage } from './SwapMessage';
import { SwapContext } from '../context';
import { getSwapQuote } from '../core/getSwapQuote';
import { isSwapError } from '../core/isSwapError';
import { formatTokenAmount } from '../../utils/formatTokenAmount';
import { useBalance, useReadContract } from 'wagmi';
import { getTokenBalances } from '../core/getTokenBalances';
import { erc20Abi } from 'viem';
import type { Address } from 'viem';
import type { SwapError, SwapLoadingState, SwapReact } from '../types';
import type { Token } from '../../token';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';
import { text } from '../../styles/theme';

export function Swap({ address, children, title = 'Swap' }: SwapReact) {
  const [error, setError] = useState<SwapError>();
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();
  const [swapLoadingState, setSwapLoadingState] = useState<SwapLoadingState>({
    isFromQuoteLoading: false,
    isSwapLoading: false,
    isToQuoteLoading: false,
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

  /* istanbul ignore next */
  const handleFromAmountChange = useCallback(
    async (amount: string) => {
      const hasRequiredFields = fromToken && toToken && amount;
      if (!hasRequiredFields) {
        return;
      }
      try {
        setSwapLoadingState({
          ...swapLoadingState,
          isToQuoteLoading: true,
        });
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
      } finally {
        setSwapLoadingState({
          ...swapLoadingState,
          isToQuoteLoading: false,
        });
      }
    },
    /* biome-ignore lint: need setState funcs */
    [fromToken, setSwapLoadingState, swapLoadingState, toToken],
  );

  /* istanbul ignore next */
  const handleToAmountChange = useCallback(
    async (amount: string) => {
      const hasRequiredFields = fromToken && toToken && amount;
      if (!hasRequiredFields) {
        return;
      }
      try {
        setSwapLoadingState({
          ...swapLoadingState,
          isFromQuoteLoading: true,
        });
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
      } finally {
        setSwapLoadingState({
          ...swapLoadingState,
          isFromQuoteLoading: false,
        });
      }
    },
    /* biome-ignore lint: need setState funcs */
    [fromToken, setSwapLoadingState, swapLoadingState, toToken],
  );

  /* istanbul ignore next */
  const handleToggle = useCallback(() => {
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setToToken(fromToken);
    setFromToken(toToken);
  }, [fromAmount, fromToken, toAmount, toToken]);

  /* biome-ignore lint: need setState funcs */
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
      setSwapLoadingState,
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
    roundedFromTokenBalance,
    roundedToTokenBalance,
    swapLoadingState,
    setError,
    setFromAmount,
    setFromToken,
    setSwapLoadingState,
    setToAmount,
    setToToken,
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
          <h3 className={text.title3} data-testid="ockSwap_Title">
            {title}
          </h3>
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
