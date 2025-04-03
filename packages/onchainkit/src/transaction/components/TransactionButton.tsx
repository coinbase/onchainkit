import { useCallback, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { getChainExplorer } from '../../core/network/getChainExplorer';
import { Spinner } from '../../internal/components/Spinner';
import { border, cn, color, pressable, text } from '../../styles/theme';
import type { TransactionButtonReact } from '../types';
import { isSpinnerDisplayed } from '../utils/isSpinnerDisplayed';
import { useTransactionContext } from './TransactionProvider';

export function TransactionButton({
  className,
  disabled = false,
  text: idleText = 'Transact',
  errorOverride,
  successOverride,
  pendingOverride,
}: TransactionButtonReact) {
  const {
    chainId,
    errorMessage,
    isLoading,
    lifecycleStatus,
    onSubmit,
    receipt,
    transactions,
    transactionCount,
    transactionHash,
    transactionId,
  } = useTransactionContext();

  const { address } = useAccount();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const accountChainId = chainId ?? useChainId();

  const isLegacyTransactionInProgress =
    lifecycleStatus.statusName === 'transactionLegacyExecuted' &&
    transactionCount !==
      lifecycleStatus?.statusData?.transactionHashList?.length;

  const isInProgress =
    lifecycleStatus.statusName === 'buildingTransaction' ||
    lifecycleStatus.statusName === 'transactionPending' ||
    isLegacyTransactionInProgress ||
    isLoading;

  const isMissingProps = !transactions || !address;
  const isWaitingForReceipt = !!transactionId || !!transactionHash;

  const isDisabled =
    !receipt &&
    (isInProgress || isMissingProps || isWaitingForReceipt || disabled);

  const displayPendingState = isSpinnerDisplayed({
    errorMessage,
    hasReceipt: !!receipt,
    isInProgress,
    transactionHash,
    transactionId,
  });

  const { errorText, successText, pendingContent } = useMemo(() => {
    const successText = successOverride?.text ?? 'View transaction';
    const errorText = errorOverride?.text ?? 'Try again';
    const pendingContent = pendingOverride?.text ?? <Spinner />;

    return { successText, errorText, pendingContent };
  }, [errorOverride, pendingOverride, successOverride]);

  const defaultSuccessHandler = useCallback(() => {
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

  const successHandler = useCallback(() => {
    if (successOverride?.onClick && receipt) {
      return successOverride?.onClick?.(receipt);
    }
    defaultSuccessHandler();
  }, [defaultSuccessHandler, successOverride, receipt]);

  const errorHandler = useCallback(() => {
    if (errorOverride?.onClick) {
      return errorOverride?.onClick?.();
    }
    // if no custom logic, retry submit
    return onSubmit();
  }, [errorOverride, onSubmit]);

  const buttonContent = useMemo(() => {
    // txn successful
    if (receipt) {
      return successText;
    }
    if (errorMessage) {
      return errorText;
    }
    if (displayPendingState) {
      return pendingContent;
    }
    return idleText;
  }, [
    displayPendingState,
    errorMessage,
    errorText,
    idleText,
    pendingContent,
    receipt,
    successText,
  ]);

  const handleSubmit = useCallback(() => {
    if (receipt) {
      successHandler();
    } else if (errorMessage) {
      errorHandler();
    } else {
      onSubmit();
    }
  }, [errorMessage, errorHandler, onSubmit, receipt, successHandler]);

  return (
    <button
      className={cn(
        pressable.primary,
        border.radius,
        'w-full rounded-xl',
        'px-4 py-3 font-medium leading-6',
        isDisabled && pressable.disabled,
        text.headline,
        color.inverse,
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
