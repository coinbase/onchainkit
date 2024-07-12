import { cn, color, text } from '../../styles/theme';
import { useTransactionContext } from './TransactionProvider';
import type { TransactionMessageReact } from '../types';

export function TransactionMessage({ className }: TransactionMessageReact) {
  const { address, contracts, errorMessage, gasFee, isLoading, transactionId } =
    useTransactionContext();

  const containerClassName = cn(
    'flex gap-2 pt-2 justify-between w-full',
    text.label2,
    className,
  );
  const testID = 'ockTransactionMessage_Message';

  if (transactionId) {
    return (
      <div className={containerClassName} data-testid={testID}>
        <p>Successful!</p>
        <a href={`https://basescan.org/tx/${transactionId}`} target="_blank">
          <span className={cn(text.label1, color.primary)}>
            View transaction
          </span>
        </a>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={containerClassName} data-testid={testID}>
        <p>Transaction in progress...</p>
        {/* TODO: figure out where this should link */}
        <a>
          <span className={cn(text.label1, color.primary)}>
            View on explorer
          </span>
        </a>
      </div>
    );
  }

  // TODO: handle different error states
  if (!errorMessage) {
    return (
      <div className={containerClassName} data-testid={testID}>
        <p className={color.error}>Something went wrong. Please try again.</p>
        {/* TODO: add functionality */}
        <button>
          <span className={cn(text.label1, color.primary)}>Try again</span>
        </button>
      </div>
    );
  }

  if (gasFee) {
    return (
      <div className={containerClassName} data-testid={testID}>
        <p>Gas fee</p>
        <p>{`${gasFee} ETH`}</p>
      </div>
    );
  }

  if (!contracts || !address) {
    return (
      <div className={containerClassName} data-testid={testID}>
        Complete the required fields to continue.
      </div>
    );
  }

  return null;
}
