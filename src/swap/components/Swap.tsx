import { Children, useCallback, useMemo, useState } from 'react';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapButton } from './SwapButton';
import { SwapToggleButton } from './SwapToggleButton';
import { SwapMessage } from './SwapMessage';
import { SwapContext } from '../context';
import { getSwapQuote } from '../core/getSwapQuote';
import { isSwapError } from '../core/isSwapError';
import { formatTokenAmount } from '../../utils/formatTokenAmount';
import { getTokenBalanceErrorState } from '../core/getTokenBalanceErrorState';
import { background, cn, text } from '../../styles/theme';
import { useGetETHBalance } from '../core/useGetETHBalance';
import { useGetTokenBalance } from '../core/useGetTokenBalance';
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
    ethBalanceResponse,
    convertedBalance: convertedETHBalance,
    roundedBalance: roundedETHBalance,
  } = useGetETHBalance(address);

  const {
    tokenBalanceResponse: fromBalanceResponse,
    convertedBalance: convertedFromBalance,
    roundedBalance: roundedFromBalance,
  } = useGetTokenBalance(address, fromToken);

  const {
    tokenBalanceResponse: toBalanceResponse,
    convertedBalance: convertedToBalance,
    roundedBalance: roundedToBalance,
  } = useGetTokenBalance(address, toToken);

  const {
    convertedToTokenBalance,
    convertedFromTokenBalance,
    roundedFromTokenBalance,
    roundedToTokenBalance,
  } = useMemo(() => {
    const isFromNativeToken = fromToken?.symbol === 'ETH';
    const isToNativeToken = toToken?.symbol === 'ETH';
    return {
      convertedFromTokenBalance: isFromNativeToken
        ? convertedETHBalance
        : convertedFromBalance,
      roundedFromTokenBalance: isFromNativeToken
        ? roundedETHBalance
        : roundedFromBalance,
      convertedToTokenBalance: isToNativeToken
        ? convertedETHBalance
        : convertedToBalance,
      roundedToTokenBalance: isToNativeToken
        ? roundedETHBalance
        : roundedToBalance,
    };
  }, [
    convertedFromBalance,
    convertedETHBalance,
    convertedToBalance,
    fromToken,
    roundedETHBalance,
    roundedFromBalance,
    roundedToBalance,
    toToken,
  ]);

  const { fromTokenBalanceError, toTokenBalanceError } = useMemo(() => {
    const fromTokenBalanceError = getTokenBalanceErrorState({
      token: fromToken,
      ethBalance: ethBalanceResponse,
      tokenBalance: fromBalanceResponse,
    });
    const toTokenBalanceError = getTokenBalanceErrorState({
      token: toToken,
      ethBalance: ethBalanceResponse,
      tokenBalance: toBalanceResponse,
    });
    return {
      fromTokenBalanceError,
      toTokenBalanceError,
    };
  }, [
    ethBalanceResponse,
    fromToken,
    toToken,
    toBalanceResponse,
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
