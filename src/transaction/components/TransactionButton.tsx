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
  text: buttonText = 'Transact',
}: TransactionButtonReact) {
  const {
    chainId,
    customStates,
    errorMessage,
    isLoading,
    lifecycleStatus,
    onSubmit,
    receipt,
    transactions,
    transactionHash,
    transactionId,
  } = useTransactionContext();

  const { address } = useAccount();

  const accountChainId = chainId ?? useChainId();
  const { showCallsStatus } = useShowCallsStatus();

  const isInProgress =
    lifecycleStatus.statusName === 'buildingTransaction' ||
    lifecycleStatus.statusName === 'transactionPending' ||
    isLoading;
  const isMissingProps = !transactions || !address;
  const isWaitingForReceipt = !!transactionId || !!transactionHash;

  const isDisabled =
    !receipt &&
    (isInProgress || isMissingProps || isWaitingForReceipt || disabled);

  const displaySpinner = isSpinnerDisplayed({
    errorMessage,
    hasReceipt: !!receipt,
    isLoading,
    lifecycleStatus,
    transactionHash,
    transactionId,
  });

  const { errorText, successText } = useMemo(() => {
    const successText = customStates?.success?.text
      ? customStates?.success?.text
      : 'View transaction';

    const errorText = customStates?.error?.text
      ? customStates?.error?.text
      : 'Try again';

    return { successText, errorText };
  }, [customStates]);

  const successHandler = useCallback(() => {
    if (customStates?.success?.onClick && receipt) {
      return customStates?.success?.onClick?.(receipt);
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
    customStates,
    showCallsStatus,
    transactionId,
    transactionHash,
    receipt,
  ]);

  const errorHandler = useCallback(() => {
    if (customStates?.error?.onClick) {
      return customStates?.error?.onClick?.();
    }
    // if no custom logic, retry submit
    return onSubmit();
  }, [customStates, onSubmit]);

  const buttonContent = useMemo(() => {
    // txn successful
    if (receipt) {
      return successText;
    }
    if (errorMessage) {
      return errorText;
    }
    return buttonText;
  }, [errorText, buttonText, successText, errorMessage, receipt]);

  const handleSubmit = useCallback(() => {
    if (receipt) {
      successHandler();
    } else if (errorMessage) {
      errorHandler();
      // if no receipt or error, submit txn
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
      {displaySpinner ? (
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
