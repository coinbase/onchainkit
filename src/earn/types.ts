export type EarnCollateralizationParams = {
  className?: string;
};

export type EarnDepositDetailsParams = {
  className?: string;
};

export type EarnProviderReact = {
  children: React.ReactNode;
};

export type EarnReact = {
  children: React.ReactNode;
  className?: string;
};

export type EarnTokenBalanceParams = {
  className?: string;
};

export type EarnTabsReact = {
  children?: React.ReactNode;
  className?: string;
};

export type EarnContextType = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
};

export type EarnDepositReact = {
  children: React.ReactNode;
  className?: string;
};

export type EarnWithdrawReact = {
  children: React.ReactNode;
  className?: string;
};

export type EarnAmountInputReact = {
  className?: string;
};
