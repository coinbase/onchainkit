import { useCallback, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { getChainExplorer } from '../../core/network/getChainExplorer';
import { Spinner } from '../../internal/components/Spinner';
import { cn, pressable, text } from '../../styles/theme';
import type { TransactionButtonProps } from '../types';
import { useTransactionContext } from './TransactionProvider';

export function TransactionButton({
  className,
  disabled = false,
  text: idleText = 'Transact',
  render,
}: TransactionButtonProps) {
  const context = useTransactionContext();
  const {
    chainId,
    errorMessage,
    isLoading,
    onSubmit,
    receipt,
    transactions,
    transactionHash,
    transactionId,
  } = context;

  const { address } = useAccount();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const accountChainId = chainId ?? useChainId();

  const isMissingProps = !transactions || !address;
  const isWaitingForReceipt = !!transactionId || !!transactionHash;

  const isDisabled =
    !receipt &&
    (isLoading || isMissingProps || isWaitingForReceipt || disabled);

  const handleSuccess = useCallback(() => {
    // SW will have txn id so open in wallet
    if (receipt && transactionId && transactionHash && chainId && address) {
      const url = new URL('https://wallet.coinbase.com/assets/transactions');
      url.searchParams.set('contentParams[txHash]', transactionHash);
      url.searchParams.set('contentParams[chainId]', JSON.stringify(chainId));
      url.searchParams.set('contentParams[fromAddress]', address);
      return window.open(url, '_blank', 'noopener,noreferrer');
    }
    // EOA will not have txn id so open in explorer
    const chainExplorer = getChainExplorer(accountChainId);
    return window.open(
      `${chainExplorer}/tx/${transactionHash}`,
      '_blank',
      'noopener,noreferrer',
    );
  }, [
    address,
    chainId,
    receipt,
    transactionId,
    transactionHash,
    accountChainId,
  ]);

  const buttonContent = useMemo(() => {
    // txn successful
    if (receipt) {
      return 'View transaction';
    }
    if (errorMessage) {
      return 'Try again';
    }
    if (isLoading) {
      return <Spinner />;
    }
    return idleText;
  }, [isLoading, errorMessage, receipt, idleText]);

  const handleSubmit = useCallback(() => {
    if (receipt) {
      handleSuccess();
    } else {
      onSubmit();
    }
  }, [onSubmit, receipt, handleSuccess]);

  const status = useMemo(() => {
    if (receipt) {
      return 'success';
    }
    if (errorMessage) {
      return 'error';
    }
    if (isLoading) {
      return 'pending';
    }
    return 'default';
  }, [isLoading, errorMessage, receipt]);

  if (render) {
    return render({
      status,
      context,
      onSubmit: handleSubmit,
      onSuccess: handleSuccess,
      isDisabled,
    });
  }

  return (
    <button
      className={cn(
        pressable.primary,
        'rounded-ock-default',
        'w-full rounded-xl',
        'px-4 py-3 font-medium leading-6',
        isDisabled && pressable.disabled,
        text.headline,
        'text-ock-text-inverse',
        className,
      )}
      onClick={handleSubmit}
      type="button"
      disabled={isDisabled}
      data-testid="ockTransactionButton_Button"
    >
      {buttonContent}
    </button>
  );
}
