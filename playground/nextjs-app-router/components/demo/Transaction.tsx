import { useCapabilities } from '@/lib/hooks';
import { clickCalls, clickContracts } from '@/lib/transactions';
import type { Call } from '@/onchainkit/esm/transaction/types';
import type { LifecycleStatus } from '@/onchainkit/src/transaction';
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
import { useCallback, useContext, useEffect, useMemo } from 'react';
import type { ContractFunctionParameters } from 'viem';
import { AppContext, TransactionTypes } from '../AppProvider';

function TransactionDemo() {
  const { chainId, transactionType } = useContext(AppContext);
  const capabilities = useCapabilities();
  const contracts = clickContracts as ContractFunctionParameters[];
  const calls = clickCalls as Call[];
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
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('Playground.Transaction.onStatus:', status);
  }, []);

  useEffect(() => {
    console.log('Playground.Transaction.transactionType:', transactionType);
    switch (transactionType) {
      case TransactionTypes.Calls:
        console.log('Playground.Transaction.calls:', calls);
        break;
      case TransactionTypes.Contracts:
        console.log('Playground.Transaction.contracts:', contracts);
        break;
      case TransactionTypes.CallsPromise:
        console.log('Playground.Transaction.callsPromise');
        break;
      case TransactionTypes.ContractsPromise:
        console.log('Playground.Transaction.contractsPromise');
        break;
    }
  }, [transactionType, calls, contracts]);

  const transactions = useMemo(() => {
    if (transactionType === TransactionTypes.Calls) {
      return {
        calls,
        contracts: undefined,
      };
    }

    if (transactionType === TransactionTypes.Contracts) {
      return {
        calls: undefined,
        contracts,
      };
    }

    if (transactionType === TransactionTypes.CallsPromise) {
      return {
        calls: promiseCalls,
        contracts: undefined,
      };
    }

    if (transactionType === TransactionTypes.ContractsPromise) {
      return {
        contracts: promiseContracts,
        calls: undefined,
      };
    }

    return { calls: undefined, contracts: undefined };
  }, [calls, promiseCalls, contracts, promiseContracts, transactionType]);

  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <Transaction
        chainId={chainId ?? 84532} // something breaks if we don't have default network?
        {...transactions}
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
