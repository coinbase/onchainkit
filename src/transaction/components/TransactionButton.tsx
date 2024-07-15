import { useCallback, useEffect } from 'react';
import { background, cn, pressable, text } from '../../styles/theme';
import { useTransactionContext } from './TransactionProvider';
import { useWriteContracts } from 'wagmi/experimental';
import { Spinner } from '../../internal/loading/Spinner';
import type { TransactionButtonReact } from '../types';
import type { TransactionExecutionError } from 'viem';

export function TransactionButton({
  className,
  text: buttonText = 'Transact',
}: TransactionButtonReact) {
  const {
    address,
    contracts,
    isLoading,
    setErrorMessage,
    setIsLoading,
    setTransactionId,
    transactionId,
  } = useTransactionContext();

  const { status, writeContracts } = useWriteContracts({
    mutation: {
      onError: (e) => {
        if (
          (e as TransactionExecutionError).cause.name ==
          'UserRejectedRequestError'
        ) {
          setErrorMessage('User rejected request');
        } else {
          setErrorMessage(e.message);
        }
      },
      onSuccess: (id) => {
        setTransactionId(id);
        // do we need this?
        // mutation.onSuccess(id);
      },
    },
  });

  const handleSubmit = useCallback(async () => {
    try {
      setErrorMessage('');
      setIsLoading(true);
      await writeContracts({
        contracts,
      });
    } catch (err) {
      console.log({ err });
    } finally {
      setIsLoading(false);
    }
  }, [contracts, setErrorMessage, setIsLoading]);

  // TODO: can possibly handling loading state with status var
  // useEffect(() => {
  //   if (status === "pending" && !isLoading) {
  //     setIsLoading(true);
  //   }
  //   if (status !== "pending" && isLoading) {
  //     setIsLoading(false);
  //   }
  // }, [isLoading, status]);

  // TODO: should disable if transactionId exists ?
  const isDisabled = isLoading || !contracts || !address || transactionId;

  return (
    <button
      className={cn(
        background.primary,
        'w-full rounded-xl',
        'mt-4 px-4 py-3 font-medium text-base text-white leading-6',
        isDisabled && pressable.disabled,
        text.headline,
        className,
      )}
      onClick={handleSubmit}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, 'text-inverse')}>{buttonText}</span>
      )}
    </button>
  );
}
