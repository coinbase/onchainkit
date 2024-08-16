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
import { useCallback, useContext, useEffect } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { AppContext } from '../AppProvider';

function TransactionDemo() {
  const { chainId } = useContext(AppContext);
  const account = useAccount();
  const capabilities = useCapabilities();
  const contracts = clickContracts;
  useEffect(() => {
    console.log('Playground.Transaction.chainId:', chainId);
  }, [chainId]);
  const handleOnStatus = useCallback((status) => {
    console.log('Playground.Transaction.onStatus:', status);
  }, []);

  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <Transaction
        chainId={chainId ?? 84532} // something breaks if we don't have default network?
        address={account.address as Address}
        contracts={contracts}
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
