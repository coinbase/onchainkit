import type { Token } from '@/token';
import type { Call } from '@/transaction/types';
import type { LifecycleStatus as TransactionLifecycleStatus } from '@/transaction/types';
import type React from 'react';
import type { Address } from 'viem';

export type EarnReact = {
  children?: React.ReactNode;
  className?: string;
  vaultAddress: Address;
};

export type EarnProviderReact = {
  children: React.ReactNode;
  vaultAddress: Address;
};

export type EarnContextType = {
  // TODO: rename to recipientAddress for clarity
  address?: Address;
  /** Balance of the asset in the vault, converted to the asset's decimals */
  convertedBalance?: string;
  vaultAddress: Address;
  /** The token that is being deposited or withdrawn */
  vaultToken: Token | undefined;
  /** Total APY of the vault, including rewards */
  apy?: number;
  /** The amount that has been deposited by the connected user in the vault */
  depositedAmount?: string;
  interest?: string;
  /** Amount that the user has typed into the deposit amount input */
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  depositCalls: Call[];
  /** Amount that the user has typed into the withdraw amount input */
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  withdrawCalls: Call[];
  lifecycleStatus: LifecycleStatus;
  updateLifecycleStatus: (status: LifecycleStatus) => void;
};

export type EarnAmountInputReact = {
  className?: string;
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
  'aria-label'?: string;
};

export type WithdrawAmountInputReact = {
  className?: string;
};

export type DepositAmountInputReact = {
  className?: string;
};
export type EarnBalanceReact = {
  className?: string;
  onActionPress: () => void;
  title: React.ReactNode;
  subtitle: string;
  showAction?: boolean;
};

export type DepositBalanceReact = {
  className?: string;
};

export type WithdrawBalanceReact = {
  className?: string;
};

export type EarnCardReact = {
  children: React.ReactNode;
  className?: string;
};

export type EarnDepositReact = {
  children?: React.ReactNode;
  className?: string;
};

export type EarnWithdrawReact = {
  children?: React.ReactNode;
  className?: string;
};

export type EarnDetailsReact = {
  className?: string;
  token?: Token;
  tag?: React.ReactNode;
};

export type DepositDetailsReact = {
  className?: string;
};

export type WithdrawDetailsReact = {
  className?: string;
};

export type DepositButtonReact = {
  className?: string;
};

export type WithdrawButtonReact = {
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
  | TransactionLifecycleStatus;
