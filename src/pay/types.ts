import type { TransactionReceipt } from 'viem';
import type { TransactionError } from '../transaction';

/**
 * List of Pay lifecycle statuses.
 * The order of the statuses loosely follows the transaction lifecycle.
 *
 * Note: exported as public Type
 */
export type LifecycleStatus =
  | {
      statusName: 'init';
      statusData: null;
    }
  | {
      statusName: 'error';
      statusData: TransactionError;
    }
  | {
      statusName: 'paymentPending';
      statusData: null;
    }
  | {
      statusName: 'success'; // if the last mutation attempt was successful
      statusData: {
        transactionReceipts: TransactionReceipt[];
        chargeId: string;
        receiptUrl: string;
      };
    };
