import type { Address } from 'viem';

export type EarnProviderReact = {
  children: React.ReactNode;
  vaultAddress: Address;
};

export type EarnContextType = {
  convertedBalance?: string;
  vaultAddress: Address;
  depositAmount: string;
  depositedAmount: string;
  setDepositAmount: (amount: string) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
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
  title: string;
  subtitle: string;
  showAction?: boolean;
};

export type DepositBalanceReact = {
  className?: string;
};

export type WithdrawBalanceReact = {
  className?: string;
};
