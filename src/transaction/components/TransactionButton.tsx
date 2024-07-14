import { useCallback } from 'react';
import { background, cn, pressable, text } from '../../styles/theme';
import { useTransactionContext } from './TransactionProvider';
import { writeContracts } from 'viem/experimental';
import { useConfig } from 'wagmi';
import { base } from 'viem/chains';
import type { TransactionButtonReact } from '../types';
import { Spinner } from '../../internal/loading/Spinner';

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

  const wagmiConfig = useConfig();

  const handleSubmit = useCallback(async () => {
    try {
      setErrorMessage('');
      setIsLoading(true);
      // const id = await writeContracts(wagmiConfig, {
      //   contracts,
      //   account: address,
      //   chain: base,
      // });

      // TODO: remove - for testing purposes only
      const id = 'transaction-id';
      setTransactionId(id);
    } catch (err) {
      console.log({ err });
      setErrorMessage('an error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
