import type { TransactionError } from '@/api/types';
import type { UseMorphoVaultReturnType } from '@/earn/hooks/useMorphoVault';
import type { LifecycleStatusUpdate } from '@/internal/types';
import type { Token } from '@/token';
import type { Call } from '@/transaction/types';
import type { LifecycleStatus as TransactionLifecycleStatus } from '@/transaction/types';
import type React from 'react';
import type { Address, TransactionReceipt } from 'viem';

/**
 * Note: exported as public Type
 */
export type EarnProps = {
  children?: React.ReactNode;
  className?: string;
  vaultAddress: Address;
  isSponsored?: boolean;
  /** An optional callback function that handles errors within the provider. */
  onError?: (error: TransactionError) => void;
  /** An optional callback function that exposes the component lifecycle state */
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  /** An optional callback function that exposes the transaction receipt */
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
};

/**
 * Note: exported as public Type
 */
export type EarnProviderProps = {
  children: React.ReactNode;
  vaultAddress: Address;
  isSponsored?: boolean;
  /** An optional callback function that handles errors within the provider. */
  onError?: (error: TransactionError) => void;
  /** An optional callback function that exposes the component lifecycle state */
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  /** An optional callback function that exposes the transaction receipt */
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
};

/**
 * Note: exported as public Type
 */
export type EarnContextType = {
  /** Warns users if vault address is invalid */
  error: Error | null;
  recipientAddress?: Address;
  /** Balance of the underlying asset in the user's wallet, converted to the asset's decimals */
  walletBalance?: string;
  /** Status of the wallet balance fetch */
  walletBalanceStatus: 'pending' | 'success' | 'error';
  refetchWalletBalance: () => void;
  vaultAddress: Address;
  /** The token that is being deposited or withdrawn (the underlying asset of the vault) */
  vaultToken: Token | undefined;
  vaultName: string | undefined;
  /** Total deposits in the vault */
  deposits: string | undefined;
  /** Total liquidity (available to borrow) in the vault */
  liquidity: string | undefined;
  /** Total APY of the vault, including rewards */
  apy: number | undefined;
  nativeApy: UseMorphoVaultReturnType['nativeApy'];
  vaultFee: UseMorphoVaultReturnType['vaultFee'];
  /** Rewards earned by the user in the vault */
  rewards: UseMorphoVaultReturnType['rewards'];
  /** The amount of underlying asset that has been deposited in the vault by the connected user */
  depositedBalance?: string;
  /** Whether the deposited balance is being fetched */
  depositedBalanceStatus: 'pending' | 'success' | 'error';
  refetchDepositedBalance: () => void;
  /** Interest earned by the user in the vault */
  interestEarned?: string;
  /** Amount that the user has typed into the deposit amount input */
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  depositAmountError: string | null;
  depositCalls: Call[];
  /** Amount that the user has typed into the withdraw amount input */
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  withdrawAmountError: string | null;
  withdrawCalls: Call[];
  lifecycleStatus: LifecycleStatus;
  updateLifecycleStatus: (
    status: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void;
  isSponsored?: boolean;
};

/**
 * Note: exported as public Type
 */
export type EarnAmountInputProps = {
  className?: string;
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
  'aria-label'?: string;
};

/**
 * Note: exported as public Type
 */
export type WithdrawAmountInputProps = {
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type DepositAmountInputProps = {
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type EarnBalanceProps = {
  className?: string;
  onActionPress: () => void;
  title: React.ReactNode;
  subtitle: string;
  showAction?: boolean;
};

/**
 * Note: exported as public Type
 */
export type DepositBalanceProps = {
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type WithdrawBalanceProps = {
  className?: string;
};

export type EarnCardProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type EarnDepositProps = {
  children?: React.ReactNode;
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type EarnWithdrawProps = {
  children?: React.ReactNode;
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type EarnDetailsProps = {
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type DepositButtonProps = {
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type WithdrawButtonProps = {
  className?: string;
};

/**
 * List of earn lifecycle statuses.
 *
 * Note: exported as public Type
 */
export type LifecycleStatus =
  | {
      statusName: 'init';
      statusData: null;
    }
  | {
      statusName: 'amountChange';
      statusData: {
        amount: string;
        token: Token;
      };
    }
  | Extract<
      TransactionLifecycleStatus,
      {
        statusName:
          | 'transactionPending'
          | 'transactionLegacyExecuted'
          | 'success'
          | 'error';
      }
    >;
