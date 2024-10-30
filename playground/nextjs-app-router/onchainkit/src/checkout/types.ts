import type { ContractFunctionParameters, TransactionReceipt } from 'viem';
import type { Address } from 'viem';
import type { Config } from 'wagmi';
import type { PayTransaction } from '../api/types';
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
      statusData: LifecycleStatusDataShared;
    }
  | {
      statusName: 'error';
      statusData: TransactionError;
    }
  | {
      statusName: 'fetchingData';
      statusData: LifecycleStatusDataShared;
    }
  | {
      statusName: 'ready';
      statusData: {
        chargeId: string;
        contracts: ContractFunctionParameters[];
      };
    }
  | {
      statusName: 'pending';
      statusData: LifecycleStatusDataShared;
    }
  | {
      statusName: 'success'; // if the last mutation attempt was successful
      statusData: {
        transactionReceipts: TransactionReceipt[];
        chargeId: string;
        receiptUrl: string;
      };
    };

type LifecycleStatusDataShared = Record<string, never>;

// make all keys in T optional if they are in K
type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

// check if all keys in T are a key of LifecycleStatusDataShared
type AllKeysInShared<T> = keyof T extends keyof LifecycleStatusDataShared
  ? true
  : false;

export type GetCommerceContractsParams = {
  transaction: PayTransaction;
};

export type GetUSDCBalanceParams = {
  address: Address;
  config: Config;
};

export type HandlePayRequestParams = {
  address: Address;
  chargeHandler?: () => Promise<string>;
  productId?: string;
};

/**
 * LifecycleStatus updater type
 * Used to type the statuses used to update LifecycleStatus
 * LifecycleStatusData is persisted across state updates allowing SharedData to be optional except for in init step
 */
export type LifecycleStatusUpdate = LifecycleStatus extends infer T
  ? T extends { statusName: infer N; statusData: infer D }
    ? { statusName: N } & (N extends 'init' // statusData required in statusName "init"
        ? { statusData: D }
        : AllKeysInShared<D> extends true // is statusData is LifecycleStatusDataShared, make optional
          ? {
              statusData?: PartialKeys<
                D,
                keyof D & keyof LifecycleStatusDataShared
              >;
            } // make all keys in LifecycleStatusDataShared optional
          : {
              statusData: PartialKeys<
                D,
                keyof D & keyof LifecycleStatusDataShared
              >;
            })
    : never
  : never;

/**
 * Note: exported as public Type
 */
export type CheckoutButtonReact = {
  className?: string;
  coinbaseBranded?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  text?: string;
};

export type CheckoutContextType = {
  errorMessage?: string;
  lifecycleStatus?: LifecycleStatus;
  onSubmit: () => void;
  updateLifecycleStatus: (status: LifecycleStatus) => void;
};

export type CheckoutProviderReact = {
  chargeHandler?: () => Promise<string>;
  children: React.ReactNode;
  isSponsored?: boolean;
  onStatus?: (status: LifecycleStatus) => void;
  productId?: string;
};

/**
 * Note: exported as public Type
 */
export type CheckoutReact = {
  chargeHandler?: () => Promise<string>;
  children: React.ReactNode;
  className?: string;
  isSponsored?: boolean;
  onStatus?: (status: LifecycleStatus) => void;
  productId?: string;
};

/**
 * Note: exported as public Type
 */
export type CheckoutStatusReact = { className?: string };

export type UseCommerceContractsParams = {
  chargeHandler?: () => Promise<string>;
  productId?: string;
};

export type UseLifecycleStatusReturn = {
  lifecycleStatus: LifecycleStatus;
  updateLifecycleStatus: (newStatus: LifecycleStatusUpdate) => void;
};
