import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { useCallback, useContext, useEffect } from 'react';
import { Pay, PayButton, PayStatus } from '../../onchainkit/src/pay';
import { AppContext } from '../AppProvider';

function PayComponent() {
  const { chainId } = useContext(AppContext);

  const handleOnStatus = useCallback((status: any) => {
    console.log('Playground.Pay.onStatus:', status);
  }, []);

  const createCharge = async () => {
    const res = await fetch(
      `${ENVIRONMENT_VARIABLES[ENVIRONMENT.API_URL]}/api/createCharge`,
      {
        method: 'POST',
      },
    );
    const data = await res.json();
    return data.id;
  };

  useEffect(() => {
    createCharge();
  }, [createCharge]);

  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <Pay
        chainId={chainId || 8453}
        chargeHandler={createCharge}
        onStatus={handleOnStatus}
      >
        <PayButton coinbaseBranded={true} />
        <PayStatus />
      </Pay>
    </div>
  );
}

export default function PayDemo() {
  return <PayComponent />;
}
