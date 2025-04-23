import {
  clickCalls,
  clickContracts,
  heterogeneousClickCalls,
} from '@/lib/transactions';
import type { Call } from '@/onchainkit/esm/transaction/types';
import type { LifecycleStatus } from '@/onchainkit/src/transaction';
import { TransactionTypes } from '@/types/onchainkit';
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
import { AppContext } from '../AppProvider';

function TransactionDemo() {
  const { chainId, transactionType, isSponsored } = useContext(AppContext);
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
  const callsCallback = useCallback(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(calls);
        }, 4000);
      }) as Promise<Call[]>,
    [calls],
  );
  const contractsCallback = useCallback(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(contracts);
        }, 4000);
      }) as Promise<ContractFunctionParameters[]>,
    [contracts],
  );
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
      case TransactionTypes.ContractsAndCalls:
        console.log(
          'Playground.Transaction.contractsAndCalls:',
          heterogeneousClickCalls,
        );
        break;
      default:
        console.log(`Playground.Transaction.${transactionType}`);
        break;
    }
  }, [transactionType, calls, contracts]);

  const transactions = useMemo(() => {
    switch (transactionType) {
      case TransactionTypes.Calls:
        return calls;
      case TransactionTypes.Contracts:
        return contracts;
      case TransactionTypes.CallsPromise:
        return promiseCalls;
      case TransactionTypes.ContractsPromise:
        return promiseContracts;
      case TransactionTypes.CallsCallback:
        return callsCallback;
      case TransactionTypes.ContractsCallback:
        return contractsCallback;
      case TransactionTypes.ContractsAndCalls:
        return heterogeneousClickCalls;
      default:
        return calls;
    }
  }, [
    calls,
    callsCallback,
    promiseCalls,
    contracts,
    contractsCallback,
    promiseContracts,
    transactionType,
  ]);

  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <Transaction
        chainId={chainId ?? 84532} // something breaks if we don't have default network?
        isSponsored={isSponsored}
        onStatus={handleOnStatus}
        calls={transactions}
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
