import { Address } from 'viem';

export type EarnProviderReact = {
  children: React.ReactNode;
  vaultAddress: Address;
};

export type EarnContextType = {
  vaultAddress: Address;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
};

export type EarnAmountInputReact = {
  className?: string;
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
};

export type WithdrawAmountInputReact = {
  className?: string;
};

export type DepositAmountInputReact = {
  className?: string;
};
