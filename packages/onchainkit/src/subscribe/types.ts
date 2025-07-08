// 🌲☀🌲
import type { APIError } from '@/api/types';
import type { Token } from '@/token';
import type { ReactNode } from 'react';
import type { Address, Hex } from 'viem';
import { SUBSCRIBE_LIFECYCLE_STATUS } from './constants';

/**
 * Duration object supporting arbitrary time unit combinations
 * Note: exported as public Type
 */
export type Duration = {
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  weeks?: number;
  months?: number;
  years?: number;
};

/**
 * SpendPermission struct matching the contract
 * Note: exported as public Type
 */
export type SpendPermission = {
  account: Address;
  spender: Address;
  token: Address;
  allowance: bigint;
  period: number;
  start: number;
  end: number;
  salt: bigint;
  extraData: Hex;
};

/**
 * Current period information from SpendPermissionManager.getCurrentPeriod()
 * Note: exported as public Type
 */
export type PeriodSpend = {
  start: number; // unix timestamp
  end: number; // unix timestamp
  spend: bigint; // accumulated spend amount for period
};

/**
 * Subscribe component success result
 * Note: exported as public Type
 */
export type SubscribeSuccessResult = {
  signature: Hex;
  spendPermission: SpendPermission;
  permissionHash: string; // Unique identifier for the spend permission
  currentPeriod?: PeriodSpend; // Current period info if permission exists
  isExistingPermission: boolean; // Whether this was an existing or new permission
  metadata: {
    amount: string;
    token: Token;
    interval: Duration;
    spender: Address;
    subscriptionLength?: Duration;
    extraData?: Hex;
  };
};

/**
 * Subscribe lifecycle statuses
 * Note: exported as public Type
 */
export type SubscribeLifecycleStatus =
  | {
      statusName: typeof SUBSCRIBE_LIFECYCLE_STATUS.INIT;
      statusData: null;
    }
  | {
      statusName: typeof SUBSCRIBE_LIFECYCLE_STATUS.LOADING;
      statusData: {
        isFetching?: boolean;
      };
    }
  | {
      statusName: typeof SUBSCRIBE_LIFECYCLE_STATUS.SIGNING;
      statusData: Record<string, never>;
    }
  | {
      statusName: typeof SUBSCRIBE_LIFECYCLE_STATUS.SUCCESS;
      statusData: SubscribeSuccessResult;
    }
  | {
      statusName: typeof SUBSCRIBE_LIFECYCLE_STATUS.SUBSCRIBED;
      statusData: {
        existingPermission: FetchPermissionsResultItem;
        currentPeriod?: PeriodSpend;
        subscriptionData: {
          amount: string;
          token: Token;
          interval: Duration;
          spender: Address;
          subscriptionLength?: Duration;
          extraData?: Hex;
          salt?: bigint | 'auto';
        };
      };
    }
  | {
      statusName: typeof SUBSCRIBE_LIFECYCLE_STATUS.ERROR;
      statusData: APIError;
    };

/**
 * Main Subscribe component props
 * Note: exported as public Type
 */
export type SubscribeReact = {
  /** Amount to charge per period */
  amount: string;
  /** Token to charge (supports Token object or string) */
  token: Token;
  /** Subscription interval duration */
  interval: Duration;
  /** Address authorized to spend user's tokens */
  spender: Address;
  /** Optional total subscription duration (defaults to unlimited) */
  subscriptionLength?: Duration;
  /** Optional button text (defaults to "Subscribe") */
  buttonText?: string;
  /** Optional custom styling */
  className?: string;
  /** Optional disabled state */
  disabled?: boolean;
  /** Optional extra data to include in spend permission (e.g., order ID, user ID) */
  extraData?: Hex;
  /** Optional salt for spend permission uniqueness (defaults to 0, use 'auto' for timestamp-based) */
  salt?: bigint | 'auto';
  /** Success callback with signature and metadata */
  onSuccess?: (result: SubscribeSuccessResult) => void;
  /** Error callback */
  onError?: (error: APIError) => void;
  /** Status change callback */
  onStatus?: (status: SubscribeLifecycleStatus) => void;
};

/**
 * SubscribeButton component props
 * Note: exported as public Type
 */
export type SubscribeButtonReact = {
  /** Optional button text (defaults to "Subscribe") */
  text?: string;
  /** Optional custom styling */
  className?: string;
  /** Optional disabled state */
  disabled?: boolean;
};

/**
 * SubscribeStatus component props
 * Note: exported as public Type
 */
export type SubscribeStatusReact = {
  /** Optional custom styling */
  className?: string;
};

/**
 * SubscribeProvider context props
 */
export type SubscribeProviderReact = {
  children: ReactNode;
  amount: string;
  token: Token;
  interval: Duration;
  spender: Address;
  subscriptionLength?: Duration;
  extraData?: Hex;
  salt?: bigint | 'auto';
  onSuccess?: (result: SubscribeSuccessResult) => void;
  onError?: (error: APIError) => void;
  onStatus?: (status: SubscribeLifecycleStatus) => void;
};

/**
 * SubscribeProvider context type
 */
export type SubscribeContextType = {
  amount: string;
  token: Token;
  interval: Duration;
  spender: Address;
  subscriptionLength?: Duration;
  extraData?: Hex;
  salt?: bigint | 'auto';
  lifecycleStatus: SubscribeLifecycleStatus;
  spendPermission?: SpendPermission;
  signature?: Hex;
  existingPermission?: FetchPermissionsResultItem | null;
  isCheckingPermissions?: boolean;
  permissionsError?: APIError | null;
  currentPeriod?: PeriodSpend;
  handleSubscribe: () => Promise<void>;
  updateLifecycleStatus: (status: SubscribeLifecycleStatus) => void;
  refresh: () => Promise<void>;
};

/**
 * Subscription status information
 * Note: exported as public Type
 */
export type SubscriptionStatus = {
  /** Whether the spend permission is approved and active */
  isActive: boolean;
  /** Whether the spend permission is revoked */
  isRevoked: boolean;
  /** Current period information */
  currentPeriod?: PeriodSpend;
  /** Remaining allowance for current period */
  remainingAllowance: bigint;
  /** Whether the current period allowance is fully spent */
  currentPeriodSpent: boolean;
  /** Days/hours until current period resets */
  timeUntilReset?: number; // seconds
  /** Subscription end time (if limited) */
  subscriptionEnd?: number;
};

/**
 * useSubscriptionStatus hook params
 * Note: exported as public Type
 */
export type UseSubscriptionStatusParams = {
  spendPermission?: SpendPermission;
  /** Optional refresh interval in milliseconds */
  refreshInterval?: number;
};

/**
 * useSubscriptionStatus hook return type
 * Note: exported as public Type
 */
export type UseSubscriptionStatusResult = {
  status?: SubscriptionStatus;
  isLoading: boolean;
  error?: APIError;
  refetch: () => void;
};

// Add types for coinbase_fetchPermissions RPC
export type FetchPermissionsRequest = {
  chainId: string; // hex, uint256
  account: string; // address
  spender: string; // address
  pageOptions?: {
    pageSize: number; // number of items requested, defaults to 50
    cursor: string; // identifier for where the page should start
  };
};

export type FetchPermissionsResult = {
  permissions: FetchPermissionsResultItem[];
  pageDescription: {
    pageSize: number; // number of items returned
    nextCursor: string; // identifier for where the next page should start
  };
};

export type FetchPermissionsResultItem = {
  createdAt: number; // UTC timestamp for when the permission was granted
  permissionHash: string; // hex
  signature: string; // hex
  spendPermission: {
    account: string; // address
    spender: string; // address
    token: string; // address
    allowance: string; // base 10 numeric string
    period: number; // unix seconds
    start: number; // unix seconds
    end: number; // unix seconds
    salt: string; // base 10 numeric string
    extraData: string; // hex
  };
};

export type UseSubscriptionPermissionsProps = {
  account?: Address;
  chainId?: number;
  spender: Address;
  token: Token;
  amount: string;
  interval: Duration;
};

export type UseSubscriptionPermissionsResult = {
  existingPermission: FetchPermissionsResultItem | null;
  isLoading: boolean;
  error: APIError | null;
  refetch: () => void;
};
