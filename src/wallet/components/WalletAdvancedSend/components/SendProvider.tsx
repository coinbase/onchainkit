import type { PortfolioTokenWithFiatValue } from '@/api/types';
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Address, Chain, Hex, TransactionReceipt } from 'viem';
import { validateAddressInput } from '@/wallet/components/WalletAdvancedSend/validateAddressInput';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { useValue } from '@/internal/hooks/useValue';
import { useWalletContext } from '@/wallet/components/WalletProvider';
import { useWalletAdvancedContext } from '@/wallet/components/WalletAdvancedProvider';
import { useExchangeRate } from '@/internal/hooks/useExchangeRate';

type SendContextType = {
  lifecycleStatus: LifecycleStatus;
  senderAddress: Address | null | undefined;
  senderChain: Chain | null | undefined;
  ethBalance: number | undefined;
  tokenBalances: PortfolioTokenWithFiatValue[] | undefined;
  recipientInput: string | null;
  setRecipientInput: Dispatch<SetStateAction<string | null>>;
  validatedRecipientAddress: Address | null;
  setValidatedRecipientAddress: Dispatch<SetStateAction<Address | null>>;
  selectedRecipientAddress: Address | null;
  setSelectedRecipientAddress: Dispatch<SetStateAction<Address | null>>;
  handleAddressSelection: (address: Address) => void;
  selectedToken: PortfolioTokenWithFiatValue | null;
  setSelectedToken: Dispatch<
    SetStateAction<PortfolioTokenWithFiatValue | null>
  >;
  handleTokenSelection: (token: PortfolioTokenWithFiatValue) => void;
  handleResetTokenSelection: () => void;
  fiatAmount: string | null;
  setFiatAmount: Dispatch<SetStateAction<string | null>>;
  cryptoAmount: string | null;
  setCryptoAmount: Dispatch<SetStateAction<string | null>>;
  exchangeRate: number;
  setExchangeRate: Dispatch<SetStateAction<number>>;
  exchangeRateLoading: boolean;
  setExchangeRateLoading: Dispatch<SetStateAction<boolean>>;
  selectedInputType: 'fiat' | 'crypto';
  setSelectedInputType: Dispatch<SetStateAction<'fiat' | 'crypto'>>;
};

type SendProviderReact = {
  children: ReactNode;
};

type LifecycleStatus =
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
      statusName: 'tokenSelected';
      statusData: {
        isMissingRequiredField: boolean;
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
      statusData: {
        isMissingRequiredField: false;
      };
    }
  | {
      statusName: 'transactionApproved';
      statusData: {
        isMissingRequiredField: false;
        callsId?: Hex;
        transactionHash?: Hex;
      };
    }
  | {
      statusName: 'success';
      statusData: {
        isMissingRequiredField: false;
        transactionReceipt: TransactionReceipt;
      };
    };

const emptyContext = {} as SendContextType;

const SendContext = createContext(emptyContext);

export function useSendContext() {
  return useContext(SendContext);
}

export function SendProvider({ children }: SendProviderReact) {
  const [ethBalance, setEthBalance] = useState<number | undefined>(undefined);
  const [recipientInput, setRecipientInput] = useState<string | null>(null);
  const [validatedRecipientAddress, setValidatedRecipientAddress] =
    useState<Address | null>(null);
  const [selectedRecipientAddress, setSelectedRecipientAddress] =
    useState<Address | null>(null);
  const [selectedToken, setSelectedToken] =
    useState<PortfolioTokenWithFiatValue | null>(null);
  const [selectedInputType, setSelectedInputType] = useState<'fiat' | 'crypto'>(
    'crypto',
  );
  const [fiatAmount, setFiatAmount] = useState<string | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [exchangeRateLoading, setExchangeRateLoading] =
    useState<boolean>(false);

  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<LifecycleStatus>({
      statusName: 'init',
      statusData: {
        isMissingRequiredField: true,
      },
    });

  const { address: senderAddress, chain: senderChain } = useWalletContext();
  const { tokenBalances } = useWalletAdvancedContext();

  useEffect(() => {
    const ethBalance = tokenBalances?.find((token) => token.address === '');
    if (ethBalance && ethBalance.cryptoBalance > 0) {
      setEthBalance(
        Number(ethBalance.cryptoBalance / 10 ** ethBalance.decimals),
      );
    }
  }, [tokenBalances]);

  // Validate recipient input and set validated recipient address
  useEffect(() => {
    async function validateRecipientInput() {
      if (recipientInput) {
        const validatedInput = await validateAddressInput(recipientInput);
        if (validatedInput) {
          setValidatedRecipientAddress(validatedInput);
        } else {
          setValidatedRecipientAddress(null);
        }
      }
    }
    validateRecipientInput();
  }, [recipientInput]);

  const handleAddressSelection = useCallback(
    (address: Address) => {
      setSelectedRecipientAddress(address);
      updateLifecycleStatus({
        statusName: 'selectingToken',
        statusData: {
          isMissingRequiredField: true,
        },
      });
    },
    [updateLifecycleStatus],
  );

  const handleTokenSelection = useCallback(
    (token: PortfolioTokenWithFiatValue) => {
      setSelectedToken(token);
      updateLifecycleStatus({
        statusName: 'tokenSelected',
        statusData: {
          isMissingRequiredField: true,
        },
      });
    },
    [updateLifecycleStatus],
  );

  const handleResetTokenSelection = useCallback(() => {
    setSelectedToken(null);
    setFiatAmount(null);
    setCryptoAmount(null);
    setExchangeRate(0);
    updateLifecycleStatus({
      statusName: 'selectingAddress',
      statusData: {
        isMissingRequiredField: true,
      },
    });
  }, [updateLifecycleStatus]);

  useEffect(() => {
    if (!selectedToken) {
      return;
    }

    useExchangeRate({
      token: selectedToken,
      selectedInputType,
      setExchangeRate,
      setExchangeRateLoading,
    });
  }, [selectedToken, selectedInputType]);

  const value = useValue({
    lifecycleStatus,
    senderAddress,
    senderChain,
    tokenBalances,
    ethBalance,
    recipientInput,
    setRecipientInput,
    validatedRecipientAddress,
    setValidatedRecipientAddress,
    selectedRecipientAddress,
    setSelectedRecipientAddress,
    handleAddressSelection,
    selectedToken,
    setSelectedToken,
    handleTokenSelection,
    handleResetTokenSelection,
    fiatAmount,
    setFiatAmount,
    cryptoAmount,
    setCryptoAmount,
    exchangeRate,
    setExchangeRate,
    exchangeRateLoading,
    setExchangeRateLoading,
    selectedInputType,
    setSelectedInputType,
  });

  return <SendContext.Provider value={value}>{children}</SendContext.Provider>;
}
