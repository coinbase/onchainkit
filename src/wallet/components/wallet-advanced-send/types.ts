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
  /** Whether the send component data has been initialized */
  isInitialized: boolean;
  /** The current lifecycle status of the send component */
  lifecycleStatus: SendLifecycleStatus;
  /** Handler for updating the lifecycle status of the send component */
  updateLifecycleStatus: (
    status: LifecycleStatusUpdate<SendLifecycleStatus>,
  ) => void;

  // Sender Context
  /** The balance of the sender's ETH wallet */
  ethBalance: number | undefined;

  // Recipient Address Context
  /** The selected recipient address */
  selectedRecipientAddress: RecipientAddress;
  /** Handler for the selection of a recipient address */
  handleAddressSelection: (selection: RecipientAddress) => void;
  /** Handler for the change of a recipient address */
  handleRecipientInputChange: () => void;

  // Token Context
  /** The token selected by the user for the send transaction */
  selectedToken: PortfolioTokenWithFiatValue | null;
  /** Handler for the selection of a token */
  handleTokenSelection: (token: PortfolioTokenWithFiatValue) => void;
  /** Handler for the reset of a token selection */
  handleResetTokenSelection: () => void;

  // Amount Context
  /** The type of input selected by the user for the send transaction, defaults to crypto */
  selectedInputType: 'fiat' | 'crypto';
  /** Handler for the selection of an input type */
  setSelectedInputType: Dispatch<SetStateAction<'fiat' | 'crypto'>>;
  /** The exchange rate for the selected token */
  exchangeRate: number;
  /** Whether the exchange rate is loading */
  exchangeRateLoading: boolean;
  /** The fiat amount selected by the user for the send transaction */
  fiatAmount: string | null;
  /** Handler for the change of a fiat amount */
  handleFiatAmountChange: (value: string) => void;
  /** The crypto amount selected by the user for the send transaction */
  cryptoAmount: string | null;
  /** Handler for the change of a crypto amount */
  handleCryptoAmountChange: (value: string) => void;

  // Transaction Context
  /** The call data for the send transaction */
  callData: Call | null;
};

export type RecipientAddress = {
  /** The value to display in the input field of the recipient address */
  display: string;
  /** The address of the recipient */
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
      statusName: 'transactionPending';
      statusData: null;
    }
  | {
      statusName: 'transactionLegacyExecuted';
      statusData: {
        transactionHashList: Address[];
      };
    }
  | {
      statusName: 'success';
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
  classNames?: {
    container?: string;
    subtitle?: string;
    fundCard?: string;
  };
};

export type SendTokenSelectorProps = {
  classNames?: {
    container?: string;
    tokenName?: string;
    tokenValue?: string;
    fiatValue?: string;
    action?: string;
  };
} & Pick<
  SendContextType,
  | 'selectedToken'
  | 'handleTokenSelection'
  | 'handleResetTokenSelection'
  | 'setSelectedInputType'
  | 'handleCryptoAmountChange'
  | 'handleFiatAmountChange'
>;
