import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Address, TransactionReceipt } from 'viem';
import type { APIError, PortfolioTokenWithFiatValue } from '../../../api/types';
import type { LifecycleStatusUpdate } from '../../../internal/types';
import type { Call } from '../../../transaction/types';

export type SendProviderReact = {
  children: ReactNode;
};

export type SendContextType = {
  // Lifecycle Status Context
  isInitialized: boolean;
  lifecycleStatus: SendLifecycleStatus;
  updateLifecycleStatus: (
    status: LifecycleStatusUpdate<SendLifecycleStatus>,
  ) => void;

  // Sender Context
  ethBalance: number | undefined;

  // Recipient Address Context
  selectedRecipientAddress: RecipientAddress;
  handleAddressSelection: (selection: RecipientAddress) => void;
  handleRecipientInputChange: () => void;

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
};

export type RecipientAddress = {
  display: string;
  value: Address | null;
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
  | {
      statusName: 'transactionPending'; // if the mutation is currently executing
      statusData: null;
    }
  | {
      statusName: 'transactionLegacyExecuted';
      statusData: {
        transactionHashList: Address[];
      };
    }
  | {
      statusName: 'success'; // if the last mutation attempt was successful
      statusData: {
        transactionReceipts: TransactionReceipt[];
      };
    }
  | {
      statusName: 'error';
      statusData: APIError;
    };

export type SendAmountInputProps = {
  className?: string;
  textClassName?: string;
} & Pick<
  SendContextType,
  | 'selectedToken'
  | 'cryptoAmount'
  | 'handleCryptoAmountChange'
  | 'fiatAmount'
  | 'handleFiatAmountChange'
  | 'selectedInputType'
  | 'setSelectedInputType'
  | 'exchangeRate'
  | 'exchangeRateLoading'
>;

export type SendFundingWalletProps = {
  onError?: () => void;
  onStatus?: () => void;
  onSuccess?: () => void;
  className?: string;
};

export type SendTokenSelectorProps = Pick<
  SendContextType,
  | 'selectedToken'
  | 'handleTokenSelection'
  | 'handleResetTokenSelection'
  | 'setSelectedInputType'
  | 'handleCryptoAmountChange'
  | 'handleFiatAmountChange'
>;
