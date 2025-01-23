import { useValue } from '@/core-react/internal/hooks/useValue';
import { usePortfolioTokenBalances } from '@/core-react/wallet/hooks/usePortfolioTokenBalances';
import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { useGetETHBalance } from '@/wallet/hooks/useGetETHBalance';
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
import { useAccount } from 'wagmi';
import { validateAddressInput } from '@/send/validateAddressInput';
import { useLifecycleStatus } from '@/core-react/internal/hooks/useLifecycleStatus';
import type { Token } from '@/token';

type SendContextType = {
  lifecycleStatus: LifecycleStatus;
  senderAddress: Address | undefined;
  senderChain: Chain | undefined;
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
      statusName: 'connectingWallet';
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
      statusName: 'addressSelected';
      statusData: {
        isMissingRequiredField: boolean;
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
  const [senderAddress, setSenderAddress] = useState<Address | undefined>(
    undefined,
  );
  const [senderChain, setSenderChain] = useState<Chain | undefined>(undefined);
  const [ethBalance, setEthBalance] = useState<number | undefined>(undefined);
  const [recipientInput, setRecipientInput] = useState<string | null>(null);
  const [validatedRecipientAddress, setValidatedRecipientAddress] =
    useState<Address | null>(null);
  const [selectedRecipientAddress, setSelectedRecipientAddress] =
    useState<Address | null>(null);
  const [tokenBalances, setTokenBalances] = useState<
    PortfolioTokenWithFiatValue[] | undefined
  >(undefined);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<LifecycleStatus>({
      statusName: 'init',
      statusData: {
        isMissingRequiredField: true,
      },
    });

  const { address, chain } = useAccount();
  useEffect(() => {
    if (address) {
      setSenderAddress(address);
    }
    if (chain) {
      setSenderChain(chain);
    }
  }, [address, chain]);

  const { response: ethBalanceResponse } = useGetETHBalance(senderAddress);
  useEffect(() => {
    if (ethBalanceResponse?.data?.value) {
      setEthBalance(
        Number(ethBalanceResponse.data.value) /
          10 ** ethBalanceResponse.data.decimals,
      );
    }
  }, [ethBalanceResponse]);

  const { data } = usePortfolioTokenBalances({
    address: senderAddress,
  });
  useEffect(() => {
    if (data?.tokenBalances) {
      setTokenBalances(data.tokenBalances);
    }
  }, [data]);

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

  useEffect(() => {
    if (lifecycleStatus.statusName === 'init') {
      if (senderAddress) {
        updateLifecycleStatus({
          statusName: 'selectingAddress',
          statusData: {
            isMissingRequiredField: true,
          },
        });
      } else {
        updateLifecycleStatus({
          statusName: 'connectingWallet',
          statusData: {
            isMissingRequiredField: true,
          },
        });
      }
    }
  }, [senderAddress, lifecycleStatus, updateLifecycleStatus]);

  useEffect(() => {
    if (lifecycleStatus.statusName === 'connectingWallet') {
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
