import { useCallback, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { Spinner } from '../../internal/components/Spinner';
import { getChainExplorer } from '../../network/getChainExplorer';
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

  const accountChainId = chainId ?? useChainId();
  const { showCallsStatus } = useShowCallsStatus();

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

  const { errorText, successText, pendingText } = useMemo(() => {
    const successText = successOverride?.text ?? 'View transaction';
    const errorText = errorOverride?.text ?? 'Try again';
    const pendingText = pendingOverride?.text;

    return { successText, errorText, pendingText };
  }, [errorOverride, pendingOverride, successOverride]);

  const successHandler = useCallback(() => {
    if (successOverride?.onClick && receipt) {
      return successOverride?.onClick?.(receipt);
    }
    // SW will have txn id so open in wallet
    if (receipt && transactionId) {
      return showCallsStatus({ id: transactionId });
    }
    // EOA will not have txn id so open in explorer
    const chainExplorer = getChainExplorer(accountChainId);
    return window.open(
      `${chainExplorer}/tx/${transactionHash}`,
      '_blank',
      'noopener,noreferrer',
    );
  }, [
    accountChainId,
    successOverride,
    showCallsStatus,
    transactionId,
    transactionHash,
    receipt,
  ]);

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
      return pendingText;
    }
    return idleText;
  }, [
    errorText,
    idleText,
    displayPendingState,
    successText,
    errorMessage,
    receipt,
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
        'px-4 py-3 font-medium text-base text-white leading-6',
        isDisabled && pressable.disabled,
        text.headline,
        className,
      )}
      onClick={handleSubmit}
      type="button"
      disabled={isDisabled}
      data-testid="ockTransactionButton_Button"
    >
      {displayPendingState && !pendingText ? (
        <Spinner />
      ) : (
        <span
          className={cn(text.headline, color.inverse, 'flex justify-center')}
        >
          {buttonContent}
        </span>
      )}
    </button>
  );
}
