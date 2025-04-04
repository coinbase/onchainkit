'use client';

/* eslint-disable react-hooks/rules-of-hooks */
import { getChainExplorer } from '@/core/network/getChainExplorer';
import { useValue } from '@/internal/hooks/useValue';
import { baseSvg } from '@/internal/svg/baseSvg';
import { coinbaseLogoSvg } from '@/internal/svg/coinbaseLogoSvg';
import { toReadableAmount } from '@/swap/utils/toReadableAmount';
import type { Token } from '@/token';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { type Address, type Hex, erc20Abi } from 'viem';
import { useAccount, useConfig } from 'wagmi';
import { getBalance, readContract } from 'wagmi/actions';
import { DEFAULT_BRIDGEABLE_TOKENS } from '../constants';
import { useChainConfig } from '../hooks/useAppchainConfig';
import { useDeposit } from '../hooks/useDeposit';
import { useWithdraw } from '../hooks/useWithdraw';
import type { ChainWithIcon } from '../types';
import type { BridgeParams } from '../types';
import type { AppchainBridgeContextType } from '../types';
import type { AppchainBridgeProviderReact } from '../types';
import { defaultPriceFetcher } from '../utils/defaultPriceFetcher';

const AppchainBridgeContext = createContext<
  AppchainBridgeContextType | undefined
>(undefined);

export const AppchainBridgeProvider = ({
  children,
  chain,
  appchain,
  bridgeableTokens = DEFAULT_BRIDGEABLE_TOKENS,
  handleFetchPrice = defaultPriceFetcher,
}: AppchainBridgeProviderReact) => {
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
    console.error(error);
    throw new Error(
      'Error loading chain configuration. Ensure you have the correct chain ID.',
    );
  }
  if (bridgeableTokens.length === 0) {
    throw new Error(
      'Bridgeable tokens must be provided as a parameter to AppchainBridge.',
    );
  }
  if (!config) {
    return null;
  }

  // Wagmi hooks
  const { address } = useAccount();
  const wagmiConfig = useConfig();

  // Bridge params
  const [bridgeParams, setBridgeParams] = useState<BridgeParams>({
    amount: '',
    amountUSD: '0.00',
    token: bridgeableTokens[0],
    recipient: address,
  });

  // Bridge state
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isResumeTransactionModalOpen, setIsResumeTransactionModalOpen] =
    useState(false);
  const direction = from.id === chain.id ? 'deposit' : 'withdraw';
  const [balance, setBalance] = useState<string>('');
  const [resumeWithdrawalTxHash, setResumeWithdrawalTxHash] = useState<Hex>();

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
    finalizedWithdrawalTxHash,
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

  // Retrieves the ETH or ERC20 balance of the user
  // Based on the currently selected token
  const fetchBalance = useCallback(async () => {
    if (!address) {
      return;
    }

    const tokenAddress =
      direction === 'deposit'
        ? bridgeParams.token.address
        : bridgeParams.token.remoteToken;

    let _balance: string;

    if (
      !tokenAddress ||
      /* v8 ignore next 1 */
      (direction === 'withdraw' && bridgeParams.token.isCustomGasToken)
    ) {
      const ethBalance = await getBalance(wagmiConfig, {
        address,
        chainId: from.id,
      });
      _balance = toReadableAmount(
        ethBalance.value.toString(),
        ethBalance.decimals,
      );
    } else {
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
    }

    setBalance(_balance);
  }, [address, direction, bridgeParams.token, from.id, wagmiConfig]);

  // Fetch balance when bridge params change
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Fetch balance when withdraw is successful
  useEffect(() => {
    if (
      withdrawStatus === 'claimSuccess' ||
      depositStatus === 'depositSuccess'
    ) {
      fetchBalance();
    }
  }, [withdrawStatus, depositStatus, fetchBalance]);

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
    [handleFetchPrice],
  );

  const handleAddressSelect = useCallback((address: Address) => {
    setBridgeParams((prev) => ({
      ...prev,
      recipient: address,
    }));
  }, []);

  const handleResumeTransaction = useCallback((txHash: Hex) => {
    setResumeWithdrawalTxHash(txHash);
    setIsResumeTransactionModalOpen(false);
  }, []);

  const handleOpenExplorer = useCallback(() => {
    const blockExplorerUrl = getChainExplorer(chain.id);
    const txHash =
      depositStatus === 'depositSuccess'
        ? depositTransactionHash
        : finalizedWithdrawalTxHash;
    window.open(`${blockExplorerUrl}/tx/${txHash}`, '_blank');
  }, [
    chain.id,
    depositStatus,
    depositTransactionHash,
    finalizedWithdrawalTxHash,
  ]);

  const handleDeposit = useCallback(async () => {
    await deposit({
      config,
      from,
      bridgeParams,
    });
  }, [deposit, config, from, bridgeParams]);

  const handleWithdraw = useCallback(async () => {
    await withdraw();
  }, [withdraw]);

  const handleResetState = useCallback(() => {
    setIsSuccessModalOpen(false);
    setIsWithdrawModalOpen(false);
    setIsResumeTransactionModalOpen(false);

    setResumeWithdrawalTxHash(undefined);
  }, []);

  // Open withdraw modal when withdraw is successful, or when transaction is resumed
  useEffect(() => {
    if (withdrawStatus === 'withdrawSuccess' || resumeWithdrawalTxHash) {
      setIsWithdrawModalOpen(true);
    }
  }, [withdrawStatus, resumeWithdrawalTxHash]);

  // Reset withdraw status when withdraw modal is closed
  useEffect(() => {
    if (!isWithdrawModalOpen) {
      resetWithdrawStatus();
    }
  }, [isWithdrawModalOpen, resetWithdrawStatus]);

  // Open success modal when deposit is successful
  useEffect(() => {
    if (depositStatus === 'depositSuccess') {
      setIsSuccessModalOpen(true);
    }
  }, [depositStatus]);

  // Open success modal when withdraw is successful
  useEffect(() => {
    if (withdrawStatus === 'claimSuccess') {
      setIsSuccessModalOpen(true);
    }
  }, [withdrawStatus]);

  const value = useValue({
    // Internal
    config,
    from,
    to,
    bridgeableTokens,
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

    // Success modal
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    handleOpenExplorer,
    handleResetState,

    // Resume transaction modal
    isResumeTransactionModalOpen,
    setIsResumeTransactionModalOpen,
    resumeWithdrawalTxHash,
    setResumeWithdrawalTxHash,
    handleResumeTransaction,

    // Deposits and Withdrawals
    handleDeposit,
    depositStatus,
    depositTransactionHash,
    direction,
    handleWithdraw,
    withdrawStatus,
    waitForWithdrawal,
    proveAndFinalizeWithdrawal,
    finalizedWithdrawalTxHash,
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
