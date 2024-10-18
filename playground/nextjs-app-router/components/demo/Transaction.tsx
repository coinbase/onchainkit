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
import { Call } from '@/onchainkit/esm/transaction/types';
import { ContractFunctionParameters } from 'viem';

function TransactionDemo() {
  const { chainId, transactionType } = useContext(AppContext);
  const capabilities = useCapabilities();
  const contracts = clickContracts;
  const calls = clickCalls;
  const promiseCalls = new Promise((resolve) => {
    setTimeout(() => {
      resolve(calls);
    }, 4000);
  }) as Promise<Call[]>;  
  const promiseContracts = new Promise((resolve) => {
    setTimeout(() => {
      resolve(contracts);
    }, 4000);
  }) as Promise<ContractFunctionParameters[]>;  
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
          ? { calls: promiseCalls }
          : { contracts: promiseContracts })}
        capabilities={capabilities}
        onStatus={handleOnStatus}
      >
        <TransactionButton
          text="Click"
          disabled={!chainId && !transactionType}
        />
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
