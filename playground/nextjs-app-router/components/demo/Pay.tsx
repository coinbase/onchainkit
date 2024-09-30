import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { useCallback, useMemo } from 'react';
import { useContext } from 'react';
import { Pay, PayButton, PayStatus } from '../../onchainkit/src/pay';
import { AppContext, PayTypes } from '../AppProvider';

function PayComponent() {
  const { payTypes, payOptions } = useContext(AppContext);

  const chargeIDKey = useMemo(() => {
    return `${payOptions?.description}-${payOptions?.name}`;
  }, [payOptions]);

  const productIDKey = useMemo(() => {
    return `${payOptions?.productId}`;
  }, [payOptions]);

  const handleOnStatus = useCallback((status: any) => {
    console.log('Playground.Pay.onStatus:', status);
  }, []);

  const createCharge = useCallback(async () => {
    try {
      const res = await fetch(
        `${ENVIRONMENT_VARIABLES[ENVIRONMENT.API_URL]}/api/createCharge`,
        {
          method: 'POST',
          body: JSON.stringify(payOptions),
        },
      );
      const data = await res.json();

      return data.id;
    } catch (error) {
      console.error('Error creating charge:', error);
      throw error;
    }
  }, [payOptions]);

  const isButtonDisabled = !payOptions?.description || !payOptions?.name;

  return (
    <div className="mx-auto grid w-1/2 gap-8">
      {payTypes === PayTypes.ProductID && (
        <>
          <Pay
            key={productIDKey}
            productId={payOptions?.productId}
            onStatus={handleOnStatus}
          >
            <PayButton coinbaseBranded={true} />
            <PayStatus />
          </Pay>
        </>
      )}
      {payTypes === PayTypes.ChargeID && (
        <>
          <Pay
            key={chargeIDKey}
            chargeHandler={createCharge}
            onStatus={handleOnStatus}
          >
            <PayButton coinbaseBranded={true} disabled={isButtonDisabled} />
            <PayStatus />
          </Pay>
        </>
      )}
    </div>
  );
}

export default function PayDemo() {
  return <PayComponent />;
}
