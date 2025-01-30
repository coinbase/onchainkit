import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Address, Chain } from 'viem';
import type { PortfolioTokenWithFiatValue } from '../../../api/types';
import type {
  Call,
  LifecycleStatus as TransactionLifecycleStatus,
} from '../../../transaction/types';

export type SendProviderReact = {
  children: ReactNode;
};

export type SendContextType = {
  // Lifecycle Status Context
  isInitialized: boolean;
  lifecycleStatus: SendLifecycleStatus;
  updateLifecycleStatus: (newStatus: SendLifecycleStatus) => void;

  // Wallet Context
  senderAddress: Address | null | undefined;
  senderChain: Chain | null | undefined;
  ethBalance: number | undefined;
  tokenBalances: PortfolioTokenWithFiatValue[] | undefined;

  // Recipient Address Context
  recipientInput: string | null;
  setRecipientInput: Dispatch<SetStateAction<string | null>>;
  validatedRecipientAddress: Address | null;
  selectedRecipientAddress: Address | null;
  handleAddressSelection: (address: Address) => void;
  handleRecipientInputChange: (input: string) => void;

  // Token Context
  selectedToken: PortfolioTokenWithFiatValue | null;
  handleTokenSelection: (token: PortfolioTokenWithFiatValue) => void;
  handleResetTokenSelection: () => void;

  // Amount Context
  selectedInputType: 'fiat' | 'crypto';
  setSelectedInputType: Dispatch<SetStateAction<'fiat' | 'crypto'>>;
  exchangeRate: number;
  exchangeRateLoading: boolean;
  fiatAmount: string | null;
  handleFiatAmountChange: (value: string) => void;
  cryptoAmount: string | null;
  handleCryptoAmountChange: (value: string) => void;

  // Transaction Context
  callData: Call | null;
  sendTransactionError: string | null;
};

export type SendLifecycleStatus =
  | {
      statusName: 'init';
      statusData: {
        isMissingRequiredField: true;
      };
    }
  | {
      statusName: 'fundingWallet';
      statusData: {
        isMissingRequiredField: true;
      };
    }
  | {
      statusName: 'selectingAddress';
      statusData: {
        isMissingRequiredField: true;
      };
    }
  | {
      statusName: 'selectingToken';
      statusData: {
        isMissingRequiredField: true;
      };
    }
  | {
      statusName: 'amountChange';
      statusData: {
        isMissingRequiredField: boolean;
        sufficientBalance: boolean;
      };
    }
  | TransactionLifecycleStatus;
