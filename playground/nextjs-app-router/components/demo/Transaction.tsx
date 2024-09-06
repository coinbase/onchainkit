import { useCapabilities } from '@/lib/hooks';
import { clickCalls, clickContracts } from '@/lib/transactions';
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
import { useCallback, useContext, useEffect } from 'react';
import { AppContext, TransactionTypes } from '../AppProvider';

function TransactionDemo() {
  const { chainId, transactionType } = useContext(AppContext);
  const capabilities = useCapabilities();
  const contracts = clickContracts;
  const calls = clickCalls;
  useEffect(() => {
    console.log('Playground.Transaction.chainId:', chainId);
  }, [chainId]);
  const handleOnStatus = useCallback((status) => {
    console.log('Playground.Transaction.onStatus:', status);
  }, []);

  useEffect(() => {
    console.log('Playground.Transaction.transactionType:', transactionType);
    if (transactionType === TransactionTypes.Calls) {
      console.log('Playground.Transaction.calls:', calls);
    } else {
      console.log('Playground.Transaction.contracts:', contracts);
    }
  }, [transactionType, calls, contracts]);

  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <Transaction
        chainId={chainId ?? 84532} // something breaks if we don't have default network?
        {...(transactionType === TransactionTypes.Calls
          ? { calls }
          : { contracts })}
        capabilities={capabilities}
        onStatus={handleOnStatus}
      >
        <TransactionButton text="Click" />
        <TransactionSponsor />
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
    </div>
  );
}

export default TransactionDemo;
