import { getCallsStatus } from '@wagmi/core/experimental';
import { useCallback, useEffect, useState } from 'react';
import { useConfig } from 'wagmi';
import { usePayCharge } from './hooks/usePayCharge';

type CommercePayButtonProps = {
  chargeId: string;
  onSuccess?: ({
    transactionHash,
    commerceReceiptUrl,
  }: {
    transactionHash: string;
    commerceReceiptUrl: string;
  }) => void;
  onError?: (err: Error) => void;
};

const BASE_COMMERCE_URL = 'https://api.commerce.coinbase.com';

export function CommercePayButton({ chargeId, onSuccess, onError }: CommercePayButtonProps) {
  const [transactionCallsId, setTransactionCallsId] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const { payCharge } = usePayCharge()
  const config = useConfig();

  useEffect(() => {
    async function checkCallsStatus() {
      const { status, receipts } = await getCallsStatus(config, {
        id: transactionCallsId,
      });
      if (status === 'CONFIRMED') {
        const transactionHash = receipts?.[0].transactionHash;
        if (transactionHash) {
          setTransactionHash(transactionHash);
          onSuccess?.({ transactionHash, commerceReceiptUrl: `https://commerce.coinbase.com/pay/${chargeId}/receipt` })
        }
      }
    }
    const interval = setInterval(() => {
      if (transactionCallsId && !transactionHash) {
        checkCallsStatus();
      }
    }, 2000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [transactionCallsId, transactionHash]);

  const handlePayment = useCallback(async () => {
    const { paymentCallsId } = await payCharge({ chargeId, wagmiConfig: config, commerceUrl: BASE_COMMERCE_URL})
    setTransactionCallsId(paymentCallsId);
  }, [payCharge, chargeId, config, setTransactionCallsId]);

  if (!transactionHash && transactionCallsId) {
    return <div>Processing...</div>;
  }
  if (transactionHash) {
    return (
      <div>
        <div>Payment Complete</div>
        <a href={`https://basescan.org/tx/${transactionHash}`}>
          View on Block Explorer
        </a>
      </div>
    );
  }
  return (
    <div>
      <button className="rounded-full border border-black bg-black px-4 py-2 text-black transition hover:bg-gray-1000" type="button" onClick={() => handlePayment()}>
        Pay with Crypto
      </button>
    </div>
  );
}
