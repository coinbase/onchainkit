import { useValue } from '@/core-react/internal/hooks/useValue';
import { usePortfolioTokenBalances } from '@/core-react/wallet/hooks/usePortfolioTokenBalances';
import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { useGetETHBalance } from '@/wallet/hooks/useGetETHBalance';
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Address, Chain, Hex, TransactionReceipt } from 'viem';
import { useAccount } from 'wagmi';
import { validateAddressInput } from '@/send/validateAddressInput';

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
      statusName: 'addressSelected';
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
        isMissingRequiredField: boolean;
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
  const [tokenBalances, setTokenBalances] = useState<
    PortfolioTokenWithFiatValue[] | undefined
  >(undefined);
  const [recipientInput, setRecipientInput] = useState<string | null>(null);
  const [validatedRecipientAddress, setValidatedRecipientAddress] =
    useState<Address | null>(null);
  const [selectedRecipientAddress, setSelectedRecipientAddress] =
    useState<Address | null>(null);
  const [lifecycleStatus, setLifecycleStatus] = useState<LifecycleStatus>({
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
  });

  return <SendContext.Provider value={value}>{children}</SendContext.Provider>;
}
