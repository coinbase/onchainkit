import { useMemo } from 'react';
import { color } from '../../styles/theme.js';
import { useTransactionContext } from '../components/TransactionProvider.js';
function useGetTransactionStatusLabel() {
  const _useTransactionContex = useTransactionContext(),
    errorMessage = _useTransactionContex.errorMessage,
    isLoading = _useTransactionContex.isLoading,
    receipt = _useTransactionContex.receipt,
    lifecycleStatus = _useTransactionContex.lifecycleStatus,
    transactionHash = _useTransactionContex.transactionHash,
    transactionId = _useTransactionContex.transactionId;
  // user confirmed in wallet, txn in progress
  const isInProgress = isLoading || !!transactionId || !!transactionHash;

  // user started txn and needs to confirm in wallet
  const isPending = lifecycleStatus.statusName === 'transactionPending';

  // waiting for calls or contracts promise to resolve
  const isBuildingTransaction = lifecycleStatus.statusName === 'buildingTransaction';
  return useMemo(() => {
    let label = '';
    let labelClassName = color.foregroundMuted;
    if (isBuildingTransaction) {
      label = 'Building transaction...';
    }
    if (isPending) {
      label = 'Confirm in wallet.';
    }
    if (isInProgress) {
      label = 'Transaction in progress...';
    }
    if (receipt) {
      label = 'Successful';
    }
    if (errorMessage) {
      label = errorMessage;
      labelClassName = color.error;
    }
    return {
      label,
      labelClassName
    };
  }, [errorMessage, isBuildingTransaction, isInProgress, isPending, receipt]);
}
export { useGetTransactionStatusLabel };
//# sourceMappingURL=useGetTransactionStatusLabel.js.map
