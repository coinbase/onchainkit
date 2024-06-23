import { Children, useCallback, useMemo, useState } from 'react';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapButton } from './SwapButton';
import { SwapToggleButton } from './SwapToggleButton';
import { SwapMessage } from './SwapMessage';
import { SwapContext } from '../context';
import { getSwapQuote } from '../core/getSwapQuote';
import { isSwapError } from '../core/isSwapError';
import { formatTokenAmount } from '../../utils/formatTokenAmount';
import { background, cn, text } from '../../styles/theme';
import { useGetETHBalance } from '../../wallet/core/useGetETHBalance';
import { useGetTokenBalance } from '../../wallet/core/useGetTokenBalance';
import type {
  SwapError,
  SwapErrorState,
  SwapLoadingState,
  SwapReact,
} from '../types';
import type { Token } from '../../token';

export function Swap({ address, children, title = 'Swap' }: SwapReact) {
  const [swapErrorState, setSwapErrorState] = useState<SwapErrorState>();
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();
  const [swapLoadingState, setSwapLoadingState] = useState<SwapLoadingState>({
    isFromQuoteLoading: false,
    isSwapLoading: false,
    isToQuoteLoading: false,
  });

  const {
    convertedBalance: convertedETHBalance,
    roundedBalance: roundedETHBalance,
    error: ethBalanceError,
  } = useGetETHBalance(address);

  const {
    convertedBalance: convertedFromBalance,
    error: fromBalanceError,
    roundedBalance: roundedFromBalance,
  } = useGetTokenBalance(address, fromToken);

  const {
    convertedBalance: convertedToBalance,
    roundedBalance: roundedToBalance,
    error: toBalanceError,
  } = useGetTokenBalance(address, toToken);

  /* istanbul ignore next */
  const {
    convertedToTokenBalance,
    convertedFromTokenBalance,
    fromTokenBalanceError,
    roundedFromTokenBalance,
    roundedToTokenBalance,
    toTokenBalanceError,
  } = useMemo(() => {
    const isFromNativeToken = fromToken?.symbol === 'ETH';
    const isToNativeToken = toToken?.symbol === 'ETH';
    return {
      convertedFromTokenBalance: isFromNativeToken
        ? convertedETHBalance
        : convertedFromBalance,
      convertedToTokenBalance: isToNativeToken
        ? convertedETHBalance
        : convertedToBalance,
      fromTokenBalanceError: isFromNativeToken
        ? ethBalanceError
        : fromBalanceError,
      roundedFromTokenBalance: isFromNativeToken
        ? roundedETHBalance
        : roundedFromBalance,
      roundedToTokenBalance: isToNativeToken
        ? roundedETHBalance
        : roundedToBalance,
      toTokenBalanceError: isToNativeToken ? ethBalanceError : toBalanceError,
    };
  }, [
    convertedFromBalance,
    convertedETHBalance,
    convertedToBalance,
    ethBalanceError,
    fromBalanceError,
    fromToken,
    roundedETHBalance,
    roundedFromBalance,
    roundedToBalance,
    toBalanceError,
    toToken,
  ]);

  /* istanbul ignore next */
  const handleFromAmountChange = useCallback(
    async (amount: string) => {
      const hasRequiredFields = fromToken && toToken && amount;
      if (!hasRequiredFields) {
        return;
      }
      try {
        /* when fromAmount changes we fetch quote for toAmount
        so set isToQuoteLoading to true */
        setSwapLoadingState({
          ...swapLoadingState,
          isToQuoteLoading: true,
        });
        setSwapErrorState({
          ...swapErrorState,
          quoteError: undefined,
        });
        const response = await getSwapQuote({
          from: fromToken,
          to: toToken,
          amount,
          amountReference: 'from',
        });
        /* if request resolves to error response set the quoteError
        property of error state to the SwapError response */
        if (isSwapError(response)) {
          setSwapErrorState({ ...swapErrorState, quoteError: response });
          return;
        }
        const formattedAmount = formatTokenAmount(
          response?.toAmount,
          response?.to?.decimals,
        );
        setToAmount(formattedAmount);
      } catch (err) {
        setSwapErrorState({ ...swapErrorState, quoteError: err as SwapError });
      } finally {
        /* reset loading state when quote request resolves */
        setSwapLoadingState({
          ...swapLoadingState,
          isToQuoteLoading: false,
        });
      }
    },
    [fromToken, swapErrorState, swapLoadingState, toToken],
  );

  /* istanbul ignore next */
  const handleToAmountChange = useCallback(
    async (amount: string) => {
      const hasRequiredFields = fromToken && toToken && amount;
      if (!hasRequiredFields) {
        return;
      }
      try {
        /* when toAmount changes we fetch quote for fromAmount
        so set isFromQuoteLoading to true */
        setSwapLoadingState({
          ...swapLoadingState,
          isFromQuoteLoading: true,
        });
        setSwapErrorState({
          ...swapErrorState,
          quoteError: undefined,
        });
        const response = await getSwapQuote({
          from: fromToken,
          to: toToken,
          amount,
          amountReference: 'to',
        });
        /* if request resolves to error response set the quoteError
        property of error state to the SwapError response */
        if (isSwapError(response)) {
          setSwapErrorState({ ...swapErrorState, quoteError: response });
          return;
        }
        const formattedAmount = formatTokenAmount(
          response.fromAmount,
          response?.from?.decimals,
        );
        setFromAmount(formattedAmount);
      } catch (err) {
        setSwapErrorState({ ...swapErrorState, quoteError: err as SwapError });
      } finally {
        /* reset loading state when quote request resolves */
        setSwapLoadingState({
          ...swapLoadingState,
          isFromQuoteLoading: false,
        });
      }
    },
    [fromToken, swapErrorState, swapLoadingState, toToken],
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
      fromAmount,
      fromToken,
      handleFromAmountChange,
      handleToAmountChange,
      handleToggle,
      roundedFromTokenBalance,
      roundedToTokenBalance,
      setSwapErrorState,
      setFromAmount,
      setFromToken,
      setToToken,
      setToAmount,
      setSwapLoadingState,
      swapErrorState: {
        ...swapErrorState,
        fromTokenBalanceError,
        toTokenBalanceError,
      },
      swapLoadingState,
      toAmount,
      toToken,
    };
  }, [
    address,
    convertedFromTokenBalance,
    convertedToTokenBalance,
    fromAmount,
    fromToken,
    fromTokenBalanceError,
    handleFromAmountChange,
    handleToAmountChange,
    handleToggle,
    roundedFromTokenBalance,
    roundedToTokenBalance,
    setFromAmount,
    setFromToken,
    setToAmount,
    setToToken,
    setSwapErrorState,
    setSwapLoadingState,
    swapErrorState,
    swapLoadingState,
    toAmount,
    toToken,
    toTokenBalanceError,
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
      <div
        className={cn(
          background.default,
          'flex w-[500px] flex-col rounded-xl px-6 pt-6 pb-4',
        )}
      >
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
