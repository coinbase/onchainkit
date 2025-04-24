import type { LifecycleStatusUpdate } from '@/internal/types';
import type { ContractFunctionParameters, TransactionReceipt } from 'viem';
import type { Address } from 'viem';
import type { Config } from 'wagmi';
import type { PayTransaction } from '../api/types';
import type { TransactionError } from '../transaction';

/** List of Pay lifecycle statuses.
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

/** Note: exported as public Type */
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
  updateLifecycleStatus: (
    status: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void;
};

export type CheckoutProviderReact = {
  chargeHandler?: () => Promise<string>;
  children: React.ReactNode;
  isSponsored?: boolean;
  onStatus?: (status: LifecycleStatus) => void;
  productId?: string;
};

/** Note: exported as public Type */
export type CheckoutReact = {
  chargeHandler?: () => Promise<string>;
  children: React.ReactNode;
  className?: string;
  isSponsored?: boolean;
  onStatus?: (status: LifecycleStatus) => void;
  productId?: string;
};

/** Note: exported as public Type */
export type CheckoutStatusReact = { className?: string };

export type UseCommerceContractsParams = {
  chargeHandler?: () => Promise<string>;
  productId?: string;
};
