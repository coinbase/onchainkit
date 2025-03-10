import { AppContext } from '@/components/AppProvider';
import { Earn, type LifecycleStatus } from '@coinbase/onchainkit/earn';
import type { TransactionError } from '@coinbase/onchainkit/transaction';
import { useCallback, useContext } from 'react';
import type { TransactionReceipt } from 'viem';

export function EarnDemo() {
  const { vaultAddress } = useContext(AppContext);

  const handleOnSuccess = useCallback(
    (transactionReceipt?: TransactionReceipt) => {
      console.log('Success: ', transactionReceipt);
    },
    [],
  );

  const handleOnError = useCallback((earnError: TransactionError) => {
    console.log('Error:', earnError);
  }, []);

  const handleOnStatus = useCallback((lifecycleStatus: LifecycleStatus) => {
    console.log('Status:', lifecycleStatus);
  }, []);

  if (!vaultAddress) {
    return <div>Please set a vault address</div>;
  }

  return (
    <Earn
      vaultAddress={vaultAddress}
      onSuccess={handleOnSuccess}
      onError={handleOnError}
      onStatus={handleOnStatus}
    />
  );
}
