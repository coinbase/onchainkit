import { CheckoutTypes } from '@/types/onchainkit';
import {
  Checkout,
  CheckoutButton,
  CheckoutStatus,
} from '@coinbase/onchainkit/checkout';
import type { LifecycleStatus } from '@coinbase/onchainkit/checkout';
import { useCallback, useMemo } from 'react';
import { useContext } from 'react';
import { AppContext } from '../AppProvider';
export default function CheckoutDemo() {
  const { checkoutTypes, checkoutOptions, isSponsored } =
    useContext(AppContext);

  const chargeIDKey = useMemo(() => {
    return `${checkoutOptions?.chargeId}`;
  }, [checkoutOptions]);

  const productIDKey = useMemo(() => {
    return `${checkoutOptions?.productId}`;
  }, [checkoutOptions]);

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('Playground.Checkout.onStatus:', status);
  }, []);

  const createCharge = useCallback(async () => {
    return Promise.resolve(checkoutOptions?.chargeId || '');
  }, [checkoutOptions]);

  const chargeIDDisabled = !checkoutOptions?.chargeId;
  const productIDDisabled = !checkoutOptions?.productId;

  return (
    <div className="mx-auto grid w-1/2 gap-8">
      {checkoutTypes === CheckoutTypes.ProductID && (
        <>
          {checkoutOptions?.productId ? (
            <Checkout
              key={productIDKey}
              productId={checkoutOptions?.productId}
              onStatus={handleOnStatus}
              isSponsored={isSponsored}
            >
              <CheckoutButton
                coinbaseBranded={true}
                disabled={productIDDisabled}
              />
              <CheckoutStatus />
            </Checkout>
          ) : (
            <>
              <div className="relative flex h-full w-full flex-col items-center">
                <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col justify-center rounded-xl bg-[#000000] bg-opacity-50 text-center">
                  <div className="mx-auto w-2/3 rounded-md bg-muted p-6 text-sm">
                    Enter a Product ID to continue
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {checkoutTypes === CheckoutTypes.ChargeID && (
        <>
          {checkoutOptions?.chargeId ? (
            <Checkout
              key={chargeIDKey}
              chargeHandler={createCharge}
              onStatus={handleOnStatus}
              isSponsored={isSponsored}
            >
              <CheckoutButton
                coinbaseBranded={true}
                disabled={chargeIDDisabled}
              />
              <CheckoutStatus />
            </Checkout>
          ) : (
            <>
              <div className="relative flex h-full w-full flex-col items-center">
                <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col justify-center rounded-xl bg-[#000000] bg-opacity-50 text-center">
                  <div className="mx-auto w-2/3 rounded-md bg-muted p-6 text-sm">
                    Enter a Charge ID to continue
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
