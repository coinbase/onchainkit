import { useCapabilities } from '@/lib/hooks';
import { clickContracts } from '@/lib/transactions';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
} from '@coinbase/onchainkit/transaction';
import { useContext } from 'react';
import { AppContext } from '../AppProvider';

export function Click() {
  const { chainId } = useContext(AppContext);
  const capabilities = useCapabilities();
  const contracts = clickContracts;
  console.log('Transaction.click.chainId:', chainId);

  return (
    <Transaction
      chainId={chainId ?? 84532} // something breaks if we don't have default network?
      contracts={contracts}
      capabilities={capabilities}
    >
      <TransactionButton text="Click" />
      {capabilities?.paymasterService?.url && <TransactionSponsor />}
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
      <TransactionToast>
        <TransactionToastIcon />
        <TransactionToastLabel />
        <TransactionToastAction />
      </TransactionToast>
    </Transaction>
  );
}
