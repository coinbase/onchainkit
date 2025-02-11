import { useValue } from '@/internal/hooks/useValue';
import { baseSvg } from '@/internal/svg/baseSvg';
import { coinbaseLogoSvg } from '@/internal/svg/coinbaseLogoSvg';
import type { Token } from '@/token';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Address, Chain } from 'viem';
import { base } from 'viem/chains';
import { useAccount } from 'wagmi';
import { ETH_BY_CHAIN } from '../constants';
import { useChainConfig } from '../hooks/useAppchainConfigs';
import { useBalance } from '../hooks/useBalances';
import { useDeposit } from '../hooks/useDeposits';
import type { Appchain, ChainWithIcon } from '../types';
import type { BridgeParams } from '../types';
import type { AppchainBridgeContextType } from '../types';
import { getETHPrice } from '../utils/getETHPrice';

const AppchainBridgeContext = createContext<
  AppchainBridgeContextType | undefined
>(undefined);

interface AppchainBridgeProviderProps {
  children: ReactNode;
  chain: Chain;
  appchain: Appchain;
  handleFetchPrice?: (amount: string, token: Token) => Promise<string>;
}

export const AppchainBridgeProvider = ({
  children,
  chain,
  appchain,
  handleFetchPrice = async (amount: string, token: Token) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const price = await getETHPrice();
    return (Number(price) * Number(amount)).toFixed(2);
  },
}: AppchainBridgeProviderProps) => {
  // Source network
  const [from, setFrom] = useState<ChainWithIcon>({
    ...chain,
    icon: baseSvg,
  });
  // Destination network
  const [to, setTo] = useState<ChainWithIcon>({
    ...appchain.chain,
    icon: appchain.icon || coinbaseLogoSvg,
  });
  // op-enclave configuration https://github.com/base/op-enclave/blob/main/contracts/src/DeployChain.sol
  const { config, error } = useChainConfig({
    l2ChainId: chain.id,
    appchainChainId: appchain.chain.id,
  });

  // Wagmi hooks
  const { address } = useAccount();

  // Bridge params
  const [bridgeParams, setBridgeParams] = useState<BridgeParams>({
    amount: '',
    amountUSD: '0.00',
    token: ETH_BY_CHAIN[chain.id],
    recipient: address,
  });

  // Bridge state
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const balance = useBalance({
    address,
    token: bridgeParams.token,
    chainId: from.id,
  });
  const direction = from.id === chain.id ? 'deposit' : 'withdraw';

  // Deposit
  const {
    deposit,
    depositStatus,
    transactionHash: depositTransactionHash,
  } = useDeposit();

  if (error) {
    console.error('error loading config', error);
    throw error;
  }
  if (!config) {
    return <></>;
  }

  // Update recipient when wallet connects
  // Defaults to current wallet address
  useEffect(() => {
    setBridgeParams((prev) => ({
      ...prev,
      recipient: address,
    }));
  }, [address]);

  const handleToggle = useCallback(() => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
  }, [from, to]);

  const handleAmountChange = useCallback(
    async ({
      amount,
      token,
      remoteToken,
    }: {
      amount: string;
      token: Token;
      remoteToken?: Token;
    }) => {
      setIsPriceLoading(true);
      setBridgeParams((prev) => ({
        ...prev,
        amount,
        token,
        remoteToken,
      }));

      const amountUSD = await handleFetchPrice(amount, token);

      setBridgeParams((prev) => ({
        ...prev,
        amountUSD,
      }));
      setIsPriceLoading(false);
    },
    [],
  );

  const handleAddressSelect = useCallback(
    (address: Address) => {
      setBridgeParams((prev) => ({
        ...prev,
        recipient: address,
      }));
    },
    [bridgeParams],
  );

  const handleDeposit = useCallback(async () => {
    const blockExplorerUrl =
      from.id === base.id
        ? 'https://basescan.org/tx/'
        : 'https://sepolia.basescan.org/tx/';

    if (depositTransactionHash) {
      window.open(`${blockExplorerUrl}${depositTransactionHash}`, '_blank');
      return;
    }

    await deposit({
      config,
      from,
      bridgeParams,
    });
  }, [deposit, config, from, bridgeParams, depositTransactionHash]);

  const value = useValue({
    // Internal
    config,
    from,
    to,
    bridgeParams,
    isPriceLoading,

    // Bridge UI
    balance,
    handleToggle,
    handleAmountChange,

    // Address modal
    isAddressModalOpen,
    setIsAddressModalOpen,
    handleAddressSelect,

    // Deposits and Withdrawals
    handleDeposit,
    depositStatus,
    direction,
  });

  return (
    <AppchainBridgeContext.Provider value={value}>
      {children}
    </AppchainBridgeContext.Provider>
  );
};

export const useAppchainBridgeContext = () => {
  const context = useContext(AppchainBridgeContext);
  if (context === undefined) {
    throw new Error('useAppchainBridge must be used within a BridgeProvider');
  }
  return context;
};
