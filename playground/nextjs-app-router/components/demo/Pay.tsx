import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Pay, PayButton, PayStatus } from '../../onchainkit/src/pay';
import { AppContext } from '../AppProvider';

function PayComponent() {
  const { chainId } = useContext(AppContext);
  const [chargeId, setChargeId] = useState(null);

  const handleOnStatus = useCallback((status) => {
    console.log('Playground.Pay.onStatus:', status);
  }, []);

  const createCharge = useCallback(async () => {
    const res = await fetch(
      `${ENVIRONMENT_VARIABLES[ENVIRONMENT.API_URL]}/api/createCharge`,
      {
        method: 'POST',
      },
    );
    const data = await res.json();
    console.log('Charge id', data.id);
    setChargeId(data.id);
  }, []);

  useEffect(() => {
    createCharge();
  }, [createCharge]);

  return (
    <div className="mx-auto grid w-1/2 gap-8">
      {chargeId && (
        <Pay
          key={chargeId}
          chainId={chainId || 8453}
          chargeId={chargeId}
          onStatus={handleOnStatus}
        >
          <PayButton coinbaseBranded={true} />
          <PayStatus />
        </Pay>
      )}
    </div>
  );
}

export default function PayDemo() {
  return <PayComponent />;
}
