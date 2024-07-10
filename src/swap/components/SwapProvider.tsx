import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { buildSwapTransaction } from '../core/buildSwapTransaction';
import { isSwapError } from '../core/isSwapError';
import { useSwapBalances } from './useSwapBalances';
import { getSwapQuote } from '../core/getSwapQuote';
import { formatTokenAmount } from '../../utils/formatTokenAmount';
import type {
  SwapError,
  SwapErrorState,
  SwapContextType,
  BuildSwapTransaction,
} from '../types';
import type { Token } from '../../token';
import type { Address, TransactionReceipt } from 'viem';
import { useSendTransaction, useConfig, type BaseError, Config } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { SendTransactionMutateAsync } from 'wagmi/query';
import { USER_REJECTED_ERROR_CODE } from '../constants';

function useValue<T>(object: T): T {
  return useMemo(() => object, [object]);
}

const emptyContext = {} as SwapContextType;

export const SwapContext = createContext<SwapContextType>(emptyContext);

export function useSwapContext() {
  const context = useContext(SwapContext);
  if (context === emptyContext) {
    throw new Error('useSwapContext must be used within a Swap component');
  }
  return context;
}

function useFromTo(address: Address) {
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
  });

  return { from, to };
}

export function SwapProvider({
  address,
  children,
}: {
  children: React.ReactNode;
  address: Address;
}) {
  const [loading, setLoading] = useState(false);
  const [isTransactionPending, setPendingTransaction] = useState(false);

  const [error, setError] = useState<SwapErrorState>();
  const handleError = useCallback(
    (e: Record<string, SwapError | undefined>) => {
      setError({ ...error, ...e });
    },
    [error]
  );

  const { from, to } = useFromTo(address);

  const { sendTransactionAsync } = useSendTransaction();

  const config = useConfig();

  /* istanbul ignore next */
  const handleToggle = useCallback(() => {
    from.setAmount(to.amount);
    to.setAmount(from.amount);

    from.setToken(to.token);
    to.setToken(from.token);
  }, [from, to]);

  const handleAmountChange = useCallback(
    async (
      type: 'from' | 'to',
      amount: string,
      sToken?: Token,
      dToken?: Token
    ) => {
      const source = type === 'from' ? from : to;
      const destination = type === 'from' ? to : from;

      source.token = sToken ?? source.token;
      destination.token = dToken ?? destination.token;

      if (source.token === undefined || destination.token === undefined) {
        return;
      }

      if (amount === '' || Number.parseFloat(amount) === 0) {
        return destination.setAmount('');
      }

      /* when toAmount changes we fetch quote for fromAmount
        so set isFromQuoteLoading to true */
      destination.setLoading(true);
      handleError({
        quoteError: undefined,
      });

      try {
        const response = await getSwapQuote({
          from: source.token,
          to: destination.token,
          amount,
          amountReference: 'from',
        });
        /* if request resolves to error response set the quoteError
        property of error state to the SwapError response */
        if (isSwapError(response)) {
          return handleError({ quoteError: response });
        }

        const formattedAmount = formatTokenAmount(
          response.toAmount,
          response?.to?.decimals
        );

        destination.setAmount(formattedAmount);
      } catch (err) {
        handleError({ quoteError: err as SwapError });
      } finally {
        /* reset loading state when quote request resolves */
        destination.setLoading(false);
      }
    },
    [from, to, handleError]
  );

  const handleSubmit = useCallback(
    async function handleSubmit(
      onError?: (error: SwapError) => void,
      onSuccess?: (txReceipt: TransactionReceipt) => void | Promise<void>
    ) {
      if (!address || !from.token || !to.token || !from.amount) {
        return;
      }

      setLoading(true);
      handleError({ swapError: undefined });

      try {
        const response = await buildSwapTransaction({
          amount: from.amount,
          fromAddress: address,
          from: from.token,
          to: to.token,
        });

        if (isSwapError(response)) {
          return handleError({ swapError: response });
        }

        processSwapTransaction({
          swapTransaction: response,
          config,
          setPendingTransaction,
          setLoading,
          sendTransactionAsync,
          onSuccess,
        });

        // TODO: refresh balances
      } catch (e) {
        const userRejected = (e as BaseError).message.includes(
          'User rejected the request.'
        );
        if (userRejected) {
          setLoading(false);
          setPendingTransaction(false);
          handleError({
            swapError: {
              code: USER_REJECTED_ERROR_CODE,
              error: 'User rejected the request.',
            },
          });
        } else {
          onError?.(e as SwapError);
          handleError({ swapError: e as SwapError });
        }
      } finally {
        setLoading(false);
      }
    },
    [
      address,
      config,
      handleError,
      from.amount,
      from.token,
      sendTransactionAsync,
      to.token,
    ]
  );

  const value = useValue({
    to,
    from,
    error,
    loading,
    isTransactionPending,
    handleAmountChange,
    handleToggle,
    handleSubmit,
  });

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}

export async function processSwapTransaction({
  swapTransaction,
  config,
  setPendingTransaction,
  setLoading,
  sendTransactionAsync,
  onSuccess,
}: {
  swapTransaction: BuildSwapTransaction;
  config: Config;
  setPendingTransaction: (value: React.SetStateAction<boolean>) => void;
  setLoading: (value: React.SetStateAction<boolean>) => void;
  sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>;
  onSuccess:
    | ((txReceipt: TransactionReceipt) => void | Promise<void>)
    | undefined;
}) {
  const { transaction, approveTransaction } = swapTransaction;

  // for swaps from ERC-20 tokens,
  // if there is an approveTransaction present,
  // request approval for the amount
  if (approveTransaction?.data) {
    setPendingTransaction(true);
    const approveTxHash = await sendTransactionAsync({
      to: approveTransaction.to,
      value: approveTransaction.value,
      data: approveTransaction.data,
    });
    await waitForTransactionReceipt(config, {
      hash: approveTxHash,
      confirmations: 1,
    });
    setPendingTransaction(false);
  }

  // make the swap
  setPendingTransaction(true);
  const txHash = await sendTransactionAsync({
    to: transaction.to,
    value: transaction.value,
    data: transaction.data,
  });
  setPendingTransaction(false);

  // wait for swap to land onchain
  setLoading(true);
  const transactionObject = await waitForTransactionReceipt(config, {
    hash: txHash,
    confirmations: 1,
  });

  // user callback
  const callbackResult = onSuccess?.(transactionObject);
  if (callbackResult instanceof Promise) {
    await callbackResult;
  }
}
