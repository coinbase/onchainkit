import { useValue } from '@/core-react/internal/hooks/useValue';
import { usePortfolioTokenBalances } from '@/core-react/wallet/hooks/usePortfolioTokenBalances';
import type { PortfolioTokenWithFiatValue } from '@/core/api/types';
import { useGetETHBalance } from '@/wallet/hooks/useGetETHBalance';
// import { useWalletAdvancedContext } from '@/wallet/components/WalletAdvancedProvider';
// import { useWalletContext } from '@/wallet/components/WalletProvider';
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import type { Address, Chain } from 'viem';
import { useAccount } from 'wagmi';

type SendContextType = {
  address: Address | undefined;
  chain: Chain | undefined;
  ethBalance: number | undefined;
  tokenBalances: PortfolioTokenWithFiatValue[] | undefined;
  recipientInput: string | null;
  setRecipientInput: Dispatch<SetStateAction<string | null>>;
  recipientAddress: Address | null;
  setRecipientAddress: Dispatch<SetStateAction<Address | null>>;
};

type SendProviderReact = {
  children: ReactNode;
  address?: Address;
  chain?: Chain;
  tokenBalances?: PortfolioTokenWithFiatValue[];
};

const emptyContext = {} as SendContextType;

const SendContext = createContext(emptyContext);

export function useSendContext() {
  return useContext(SendContext);
}

export function SendProvider({
  children,
  address,
  chain,
  tokenBalances,
}: SendProviderReact) {
  // const { address: senderAddress, chain: senderChain } = useWalletContext() ?? {};
  // const { tokenBalances: senderTokenBalances } = useWalletAdvancedContext() ?? {};
  const [recipientInput, setRecipientInput] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<Address | null>(
    null,
  );

  let ethBalance: number | undefined;
  const { response } = useGetETHBalance(address);
  if (response?.data?.value) {
    ethBalance = Number(response.data.value) / 10 ** response.data.decimals;
  }

  let senderAddress = address;
  let senderChain = chain;
  if (!senderAddress || !senderChain) {
    const { address: userAddress, chain: userChain } = useAccount();
    senderAddress = userAddress;
    senderChain = userChain;
  }

  let senderTokenBalances = tokenBalances;
  if (!senderTokenBalances) {
    const { data } = usePortfolioTokenBalances({
      address: senderAddress,
    });
    senderTokenBalances = data?.tokenBalances ?? [];
  }

  const value = useValue({
    address: senderAddress,
    chain: senderChain,
    tokenBalances: senderTokenBalances,
    ethBalance,
    recipientInput,
    setRecipientInput,
    recipientAddress,
    setRecipientAddress,
  });

  return <SendContext.Provider value={value}>{children}</SendContext.Provider>;
}
