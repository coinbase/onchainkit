import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { Buy } from '@coinbase/onchainkit/buy';
import type { LifecycleStatus } from '@coinbase/onchainkit/swap';
import type { SwapError } from '@coinbase/onchainkit/swap';
import { useCallback, useContext } from 'react';
import type { TransactionReceipt } from 'viem';
import { base } from 'viem/chains';
import { degenToken } from '../../lib/constants';
import { AppContext } from '../AppProvider';

const FALLBACK_DEFAULT_MAX_SLIPPAGE = 3;

function BuyComponent() {
  const { chainId, isSponsored, defaultMaxSlippage } = useContext(AppContext);
  const handleOnStatus = useCallback((lifecycleStatus: LifecycleStatus) => {
    console.log('Status:', lifecycleStatus);
  }, []);
  const handleOnSuccess = useCallback(
    (transactionReceipt?: TransactionReceipt) => {
      console.log('Success:', transactionReceipt);
    },
    [],
  );
  const handleOnError = useCallback((swapError: SwapError) => {
    console.log('Error:', swapError);
  }, []);
  return (
    <div className="relative mb-[50%] flex h-full w-full flex-col items-center">
      {chainId !== base.id ? (
        <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col justify-center rounded-xl bg-[#000000] bg-opacity-50 text-center">
          <div className="mx-auto w-2/3 rounded-md bg-muted p-6 text-sm">
            Buy Demo is only available on Base.
            <br />
            You're connected to a different network. Switch to Base to continue
            using the app.
          </div>
        </div>
      ) : (
        <></>
      )}
      {ENVIRONMENT_VARIABLES[ENVIRONMENT.ENVIRONMENT] === 'production' &&
      chainId === base.id ? (
        <div className="mb-5 italic">
          Note: Buy is disabled on production. To test, run the app locally.
        </div>
      ) : null}
      <Buy
        disabled={
          ENVIRONMENT_VARIABLES[ENVIRONMENT.ENVIRONMENT] === 'production'
        }
        onStatus={handleOnStatus}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
        config={{
          maxSlippage: defaultMaxSlippage || FALLBACK_DEFAULT_MAX_SLIPPAGE,
        }}
        isSponsored={isSponsored}
        toToken={degenToken}
      />
    </div>
  );
}
export default function BuyDemo() {
  return (
    <div className="mx-auto">
      <BuyComponent />
    </div>
  );
}
