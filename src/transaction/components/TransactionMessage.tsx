import { cn, text } from '../../styles/theme';
import { useTransactionContext } from './TransactionProvider';
import type { TransactionMessageReact } from '../types';

export function TransactionMessage({ className }: TransactionMessageReact) {
  const { gasFee, isLoading, transactionId } = useTransactionContext();

  if (transactionId) {
    return (
      <div
        className={cn('flex pt-2 justify-between', text.label2, className)}
        data-testid="ockTransactionMessage_Message"
      >
        <p>Successful!</p>
        <button>View transaction</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn('flex pt-2 justify-between', text.label2, className)}
        data-testid="ockTransactionMessage_Message"
      >
        <p>Transaction in progress...</p>
        <button>View on explorer</button>
      </div>
    );
  }

  if (gasFee) {
    return (
      <div
        className={cn('flex pt-2 justify-between', text.label2, className)}
        data-testid="ockTransactionMessage_Message"
      >
        <p>Gas fee</p>
        <p>{`${gasFee} ETH`}</p>
      </div>
    );
  }

  return (
    <div
      className={cn('flex pt-2 justify-between', text.label2, className)}
      data-testid="ockTransactionMessage_Message"
    >
      Complete the required fields to continue.
    </div>
  );
}
