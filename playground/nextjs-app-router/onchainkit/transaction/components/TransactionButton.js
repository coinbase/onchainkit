import { useMemo, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Spinner } from '../../internal/components/Spinner.js';
import { getChainExplorer } from '../../network/getChainExplorer.js';
import { cn, pressable, border, text, color } from '../../styles/theme.js';
import { isSpinnerDisplayed } from '../utils/isSpinnerDisplayed.js';
import { useTransactionContext } from './TransactionProvider.js';
import { jsx } from 'react/jsx-runtime';
function TransactionButton({
  className,
  disabled = false,
  text: idleText = 'Transact',
  errorOverride,
  successOverride,
  pendingOverride
}) {
  const _useTransactionContex = useTransactionContext(),
    chainId = _useTransactionContex.chainId,
    errorMessage = _useTransactionContex.errorMessage,
    isLoading = _useTransactionContex.isLoading,
    lifecycleStatus = _useTransactionContex.lifecycleStatus,
    onSubmit = _useTransactionContex.onSubmit,
    receipt = _useTransactionContex.receipt,
    transactions = _useTransactionContex.transactions,
    transactionCount = _useTransactionContex.transactionCount,
    transactionHash = _useTransactionContex.transactionHash,
    transactionId = _useTransactionContex.transactionId;
  const _useAccount = useAccount(),
    address = _useAccount.address;
  const accountChainId = chainId ?? useChainId();
  const isLegacyTransactionInProgress = lifecycleStatus.statusName === 'transactionLegacyExecuted' && transactionCount !== lifecycleStatus?.statusData?.transactionHashList?.length;
  const isInProgress = lifecycleStatus.statusName === 'buildingTransaction' || lifecycleStatus.statusName === 'transactionPending' || isLegacyTransactionInProgress || isLoading;
  const isMissingProps = !transactions || !address;
  const isWaitingForReceipt = !!transactionId || !!transactionHash;
  const isDisabled = !receipt && (isInProgress || isMissingProps || isWaitingForReceipt || disabled);
  const displayPendingState = isSpinnerDisplayed({
    errorMessage,
    hasReceipt: !!receipt,
    isInProgress,
    transactionHash,
    transactionId
  });
  const _useMemo = useMemo(() => {
      const successText = successOverride?.text ?? 'View transaction';
      const errorText = errorOverride?.text ?? 'Try again';
      const pendingContent = pendingOverride?.text ?? /*#__PURE__*/jsx(Spinner, {});
      return {
        successText,
        errorText,
        pendingContent
      };
    }, [errorOverride, pendingOverride, successOverride]),
    errorText = _useMemo.errorText,
    successText = _useMemo.successText,
    pendingContent = _useMemo.pendingContent;
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
    return window.open(`${chainExplorer}/tx/${transactionHash}`, '_blank', 'noopener,noreferrer');
  }, [address, chainId, receipt, transactionId, transactionHash, accountChainId]);
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
  }, [displayPendingState, errorMessage, errorText, idleText, pendingContent, receipt, successText]);
  const handleSubmit = useCallback(() => {
    if (receipt) {
      successHandler();
    } else if (errorMessage) {
      errorHandler();
    } else {
      onSubmit();
    }
  }, [errorMessage, errorHandler, onSubmit, receipt, successHandler]);
  return /*#__PURE__*/jsx("button", {
    className: cn(pressable.primary, border.radius, 'w-full rounded-xl', 'px-4 py-3 font-medium text-base text-white leading-6', isDisabled && pressable.disabled, text.headline, className),
    onClick: handleSubmit,
    type: "button",
    disabled: isDisabled,
    "data-testid": "ockTransactionButton_Button",
    children: /*#__PURE__*/jsx("div", {
      className: cn(text.headline, color.inverse, 'flex justify-center'),
      children: buttonContent
    })
  });
}
export { TransactionButton };
//# sourceMappingURL=TransactionButton.js.map
