import { useMemo } from 'react';
import { color } from '../../styles/theme.js';
import { useTransactionContext } from '../components/TransactionProvider.js';
function useGetTransactionToastLabel() {
  const _useTransactionContex = useTransactionContext(),
    errorMessage = _useTransactionContex.errorMessage,
    isLoading = _useTransactionContex.isLoading,
    lifecycleStatus = _useTransactionContex.lifecycleStatus,
    receipt = _useTransactionContex.receipt,
    transactionHash = _useTransactionContex.transactionHash,
    transactionId = _useTransactionContex.transactionId;

  // user confirmed in wallet, txn in progress
  const isInProgress = isLoading || !!transactionId || !!transactionHash;

  // waiting for calls or contracts promise to resolve
  const isBuildingTransaction = lifecycleStatus.statusName === 'buildingTransaction';
  return useMemo(() => {
    let label = '';
    let labelClassName = color.foregroundMuted;
    if (isBuildingTransaction) {
      label = 'Building transaction';
    }
    if (isInProgress) {
      label = 'Transaction in progress';
    }
    if (receipt) {
      label = 'Successful';
    }
    if (errorMessage) {
      label = 'Something went wrong';
      labelClassName = color.error;
    }
    return {
      label,
      labelClassName
    };
  }, [errorMessage, isBuildingTransaction, isInProgress, receipt]);
}
export { useGetTransactionToastLabel };
//# sourceMappingURL=useGetTransactionToastLabel.js.map
