import { useValue } from '@/core-react/internal/hooks/useValue';
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
import { useLifecycleStatus } from '@/core-react/internal/hooks/useLifecycleStatus';
import type { Token } from '@/token';
import { useWalletContext } from '@/wallet/components/WalletProvider';
import { useWalletAdvancedContext } from '@/wallet/components/WalletAdvancedProvider';

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
  selectedToken: Token | null;
  setSelectedToken: Dispatch<SetStateAction<Token | null>>;
  handleTokenSelection: (token: Token) => void;
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
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
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
    if (lifecycleStatus.statusName === 'init') {
      if (senderAddress) {
        updateLifecycleStatus({
          statusName: 'selectingAddress',
          statusData: {
            isMissingRequiredField: true,
          },
        });
      }
    }
  }, [senderAddress, lifecycleStatus, updateLifecycleStatus]);

  // Set Lifecycle Status after fetching token balances
  useEffect(() => {
    const ethBalance = tokenBalances?.filter(
      (token) => token.symbol === 'ETH',
    )[0];
    if (!ethBalance || ethBalance.cryptoBalance === 0) {
      updateLifecycleStatus({
        statusName: 'fundingWallet',
        statusData: {
          isMissingRequiredField: true,
        },
      });
    } else if (ethBalance.cryptoBalance > 0) {
      setEthBalance(ethBalance.cryptoBalance);
      updateLifecycleStatus({
        statusName: 'selectingAddress',
        statusData: {
          isMissingRequiredField: true,
        },
      });
    }
  }, [tokenBalances, updateLifecycleStatus]);

  // Validate Recipient Input
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
    (token: Token) => {
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
  });

  return <SendContext.Provider value={value}>{children}</SendContext.Provider>;
}
