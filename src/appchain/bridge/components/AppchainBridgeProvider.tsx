import { useValue } from '@/internal/hooks/useValue';
import { baseSvg } from '@/internal/svg/baseSvg';
import { coinbaseLogoSvg } from '@/internal/svg/coinbaseLogoSvg';
import { toReadableAmount } from '@/swap/utils/toReadableAmount';
import type { Token } from '@/token';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { type Address, type Chain, erc20Abi } from 'viem';
import { base } from 'viem/chains';
import { useAccount, useConfig } from 'wagmi';
import { getBalance, readContract } from 'wagmi/actions';
import { ETH_BY_CHAIN } from '../constants';
import { useChainConfig } from '../hooks/useAppchainConfig';
import { useDeposit } from '../hooks/useDeposit';
import { useWithdraw } from '../hooks/useWithdraw';
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

  if (error) {
    console.error('error loading config', error);
    throw error;
  }
  if (!config) {
    return <></>;
  }

  // Wagmi hooks
  const { address } = useAccount();
  const wagmiConfig = useConfig();

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
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const direction = from.id === chain.id ? 'deposit' : 'withdraw';
  const [balance, setBalance] = useState<string>('');

  // Deposit
  const {
    deposit,
    depositStatus,
    transactionHash: depositTransactionHash,
    resetDepositStatus,
  } = useDeposit();
  const {
    withdraw,
    withdrawStatus,
    waitForWithdrawal,
    proveAndFinalizeWithdrawal,
    resetWithdrawStatus,
  } = useWithdraw({
    config,
    chain,
    bridgeParams,
  });

  // Update recipient when wallet connects
  // Defaults to current wallet address
  useEffect(() => {
    setBridgeParams((prev) => ({
      ...prev,
      recipient: address,
    }));
  }, [address]);

  const fetchBalance = async () => {
    if (!address) {
      return;
    }

    const tokenAddress =
      direction === 'deposit'
        ? bridgeParams.token.address
        : bridgeParams.token.remoteToken;

    let _balance: string;
    if (tokenAddress) {
      const erc20Balance = await readContract(wagmiConfig, {
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
        address: tokenAddress as Address,
        chainId: from.id,
      });
      _balance = toReadableAmount(
        erc20Balance.toString(),
        bridgeParams.token.decimals,
      );
    } else {
      const ethBalance = await getBalance(wagmiConfig, {
        address,
        chainId: from.id,
      });
      _balance = toReadableAmount(
        ethBalance.value.toString(),
        ethBalance.decimals,
      );
    }

    setBalance(_balance);
  };

  // Fetch balance when bridge params change
  useEffect(() => {
    fetchBalance();
  }, [address, bridgeParams.token, from.id, wagmiConfig]);

  // Fetch balance when withdraw is successful
  useEffect(() => {
    if (withdrawStatus === 'claimSuccess' || depositStatus === 'success') {
      fetchBalance();
    }
  }, [withdrawStatus, depositStatus]);

  // Reset deposit status when token changes
  useEffect(() => {
    resetDepositStatus();
  }, [bridgeParams.token]);

  const handleToggle = useCallback(() => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
    // Reset statuses when direction changes
    resetDepositStatus();
    resetWithdrawStatus();
  }, [from, to, resetDepositStatus, resetWithdrawStatus]);

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

    if (depositStatus === 'success') {
      window.open(`${blockExplorerUrl}${depositTransactionHash}`, '_blank');
      return;
    }

    await deposit({
      config,
      from,
      bridgeParams,
    });
  }, [
    deposit,
    depositStatus,
    config,
    from,
    bridgeParams,
    depositTransactionHash,
  ]);

  const handleWithdraw = useCallback(async () => {
    await withdraw();
  }, [withdraw, config, bridgeParams]);

  useEffect(() => {
    if (withdrawStatus === 'withdrawSuccess') {
      setIsWithdrawModalOpen(true);
    }
  }, [withdrawStatus]);

  useEffect(() => {
    if (!isWithdrawModalOpen) {
      resetWithdrawStatus();
    }
  }, [isWithdrawModalOpen, resetWithdrawStatus]);

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
    handleWithdraw,
    withdrawStatus,
    waitForWithdrawal,
    proveAndFinalizeWithdrawal,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    resetDepositStatus,
    resetWithdrawStatus,
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
