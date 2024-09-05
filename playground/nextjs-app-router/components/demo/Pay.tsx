import { useContext } from 'react';
import { Pay, PayButton } from '../../onchainkit/src/pay';
import {
  TransactionSponsor,
  TransactionToast,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionToastAction,
} from '../../onchainkit/src/transaction';
import { AppContext } from '../AppProvider';

function PayComponent() {
  const { chainId } = useContext(AppContext);

  return (
    <Pay
      chainId={chainId || 8453}
      chargeId={'91df412e-0997-42ab-8a71-99d61158197d'}
    >
      <TransactionToast>
        <TransactionToastIcon />
        <TransactionToastLabel />
        <TransactionToastAction />
      </TransactionToast>
      <PayButton />
      <TransactionSponsor />
    </Pay>
  );
}

export default function PayDemo() {
  return (
    <div className="mx-auto">
      <PayComponent />
    </div>
  );
}
