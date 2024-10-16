import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Address, ContractFunctionParameters } from 'viem';
import { base } from 'viem/chains';
import { useAccount, useConnect, useSwitchChain } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { useWriteContracts } from 'wagmi/experimental';
import { useCallsStatus } from 'wagmi/experimental';
import { useValue } from '../../internal/hooks/useValue';
import { isUserRejectedRequestError } from '../../transaction/utils/isUserRejectedRequestError';
import { useOnchainKit } from '../../useOnchainKit';
import { useIsWalletACoinbaseSmartWallet } from '../../wallet/hooks/useIsWalletACoinbaseSmartWallet';
import {
  GENERIC_ERROR_MESSAGE,
  NO_CONNECTED_ADDRESS_ERROR,
  NO_CONTRACTS_ERROR,
  USER_REJECTED_ERROR,
} from '../constants';
import {
  PAY_INSUFFICIENT_BALANCE_ERROR,
  PAY_INSUFFICIENT_BALANCE_ERROR_MESSAGE,
  PAY_LIFECYCLESTATUS,
  PayErrorCode,
} from '../constants';
import { useCommerceContracts } from '../hooks/useCommerceContracts';
import { useLifecycleStatus } from '../hooks/useLifecycleStatus';
import type { PayContextType, PayProviderReact } from '../types';

const emptyContext = {} as PayContextType;
export const PayContext = createContext<PayContextType>(emptyContext);

export function usePayContext() {
  const context = useContext(PayContext);
  if (context === emptyContext) {
    throw new Error('usePayContext must be used within a Pay component');
  }
  return context;
}

export function PayProvider({
  chargeHandler,
  children,
  isSponsored,
  onStatus,
  productId,
}: PayProviderReact) {
  // Core hooks
  const {
    config: { paymaster } = { paymaster: null },
  } = useOnchainKit();
  const { address, chainId, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const [chargeId, setChargeId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isSmartWallet = useIsWalletACoinbaseSmartWallet();

  // Refs
  const fetchedDataUseEffect = useRef<boolean>(false);
  const fetchedDataHandleSubmit = useRef<boolean>(false);
  const userRejectedRef = useRef<boolean>(false);
  const contractsRef = useRef<ContractFunctionParameters[] | null>();
  const insufficientBalanceRef = useRef<boolean>(false);
  const priceInUSDCRef = useRef<string | undefined>('');

  // Helper function used in both `useEffect` and `handleSubmit` to fetch data from the Commerce API and set state and refs
  const fetchData = useCallback(
    async (address: Address) => {
      updateLifecycleStatus({
        statusName: PAY_LIFECYCLESTATUS.FETCHING_DATA,
        statusData: {},
      });
      const {
        contracts,
        chargeId: hydratedChargeId,
        insufficientBalance,
        priceInUSDC,
        error,
      } = await fetchContracts(address);
      if (error) {
        setErrorMessage(GENERIC_ERROR_MESSAGE);
        updateLifecycleStatus({
          statusName: PAY_LIFECYCLESTATUS.ERROR,
          statusData: {
            code: PayErrorCode.UNEXPECTED_ERROR,
            error: (error as Error).name,
            message: (error as Error).message,
          },
        });
        return;
      }
      setChargeId(hydratedChargeId);
      contractsRef.current = contracts;
      insufficientBalanceRef.current = insufficientBalance;
      priceInUSDCRef.current = priceInUSDC;
      updateLifecycleStatus({
        statusName: PAY_LIFECYCLESTATUS.READY,
        statusData: {
          chargeId,
          contracts: contractsRef.current || [],
        },
      });
    },
    [chargeId],
  );

  // Component lifecycle
  const { lifecycleStatus, updateLifecycleStatus } = useLifecycleStatus({
    statusName: PAY_LIFECYCLESTATUS.INIT,
    statusData: {},
  });

  // Transaction hooks
  const fetchContracts = useCommerceContracts({
    chargeHandler,
    productId,
  });

  const { status, writeContractsAsync } = useWriteContracts({
    /* v8 ignore start */
    mutation: {
      onSuccess: (id) => {
        setTransactionId(id);
      },
    },
    /* v8 ignore stop */
  });
  const { data } = useCallsStatus({
    id: transactionId,
    query: {
      /* v8 ignore next 3 */
      refetchInterval: (query) => {
        return query.state.data?.status === 'CONFIRMED' ? false : 1000;
      },
      enabled: !!transactionId,
    },
  });
  const transactionHash = data?.receipts?.[0]?.transactionHash;
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  // Component lifecycle emitters
  useEffect(() => {
    onStatus?.(lifecycleStatus);
  }, [
    lifecycleStatus,
    lifecycleStatus.statusData, // Keep statusData, so that the effect runs when it changes
    lifecycleStatus.statusName, // Keep statusName, so that the effect runs when it changes
    onStatus,
  ]);

  // Set transaction pending status when writeContracts is pending
  useEffect(() => {
    if (status === 'pending') {
      updateLifecycleStatus({
        statusName: PAY_LIFECYCLESTATUS.PENDING,
        statusData: {},
      });
    }
  }, [status, updateLifecycleStatus]);

  // Trigger success status when receipt is generated by useWaitForTransactionReceipt
  useEffect(() => {
    if (!receipt) {
      return;
    }
    updateLifecycleStatus({
      statusName: PAY_LIFECYCLESTATUS.SUCCESS,
      statusData: {
        transactionReceipts: [receipt],
        chargeId: chargeId,
        receiptUrl: `https://commerce.coinbase.com/pay/${chargeId}/receipt`,
      },
    });
  }, [chargeId, receipt, updateLifecycleStatus]);

  // We need to pre-load transaction data in `useEffect` when the wallet is already connected due to a Smart Wallet popup blocking issue in Safari iOS
  useEffect(() => {
    if (
      lifecycleStatus.statusName === PAY_LIFECYCLESTATUS.INIT &&
      address &&
      !fetchedDataHandleSubmit.current
    ) {
      fetchedDataUseEffect.current = true;
      fetchData(address);
    }
  }, [address, fetchData, lifecycleStatus]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component to deprecate funding flow
  const handleSubmit = useCallback(async () => {
    try {
      // Open Coinbase Commerce receipt
      if (lifecycleStatus.statusName === PAY_LIFECYCLESTATUS.SUCCESS) {
        window.open(
          `https://commerce.coinbase.com/pay/${chargeId}/receipt`,
          '_blank',
          'noopener,noreferrer',
        );
        return;
      }
      // Open funding flow
      // TODO: Deprecate this once we have USDC Magic Spend
      if (
        lifecycleStatus.statusName === PAY_LIFECYCLESTATUS.ERROR &&
        lifecycleStatus.statusData?.code === PayErrorCode.INSUFFICIENT_BALANCE
      ) {
        window.open(
          'https://keys.coinbase.com/fund?asset=USDC&chainId=8453',
          '_blank',
          'noopener,noreferrer',
        );
        // Reset status
        setErrorMessage('');
        updateLifecycleStatus({
          statusName: PAY_LIFECYCLESTATUS.INIT,
          statusData: {},
        });
        return;
      }

      let connectedAddress = address;
      let connectedChainId = chainId;
      if (!isConnected || !isSmartWallet) {
        // Prompt for wallet connection
        // This is defaulted to Coinbase Smart Wallet
        fetchedDataHandleSubmit.current = true; // Set this here so useEffect does not run
        const { accounts, chainId: _connectedChainId } = await connectAsync({
          connector: coinbaseWallet({ preference: 'smartWalletOnly' }),
        });
        connectedAddress = accounts[0];
        connectedChainId = _connectedChainId;
      }

      // This shouldn't ever happen, but to make Typescript happy
      /* v8 ignore start */
      if (!connectedAddress) {
        setErrorMessage(GENERIC_ERROR_MESSAGE);
        updateLifecycleStatus({
          statusName: PAY_LIFECYCLESTATUS.ERROR,
          statusData: {
            code: PayErrorCode.UNEXPECTED_ERROR,
            error: NO_CONNECTED_ADDRESS_ERROR,
            message: NO_CONNECTED_ADDRESS_ERROR,
          },
        });
        return;
      }
      /* v8 ignore stop */

      // Fetch contracts if not already done in useEffect
      // Don't re-fetch contracts if the user rejected the previous request, and just use the cached data
      /* v8 ignore next 3 */
      if (!fetchedDataUseEffect.current && !userRejectedRef.current) {
        await fetchData(connectedAddress);
      }

      // Switch chain, if applicable
      if (connectedChainId !== base.id) {
        await switchChainAsync({ chainId: base.id });
      }

      // Check for sufficient balance
      if (insufficientBalanceRef.current && priceInUSDCRef.current) {
        setErrorMessage(
          PAY_INSUFFICIENT_BALANCE_ERROR_MESSAGE(priceInUSDCRef.current),
        );
        updateLifecycleStatus({
          statusName: PAY_LIFECYCLESTATUS.ERROR,
          statusData: {
            code: PayErrorCode.INSUFFICIENT_BALANCE,
            error: PAY_INSUFFICIENT_BALANCE_ERROR,
            message: PAY_INSUFFICIENT_BALANCE_ERROR_MESSAGE(
              priceInUSDCRef.current,
            ),
          },
        });
        return;
      }

      // Contracts weren't successfully fetched from `fetchContracts`
      if (!contractsRef.current || contractsRef.current.length === 0) {
        setErrorMessage(GENERIC_ERROR_MESSAGE);
        updateLifecycleStatus({
          statusName: PAY_LIFECYCLESTATUS.ERROR,
          statusData: {
            code: PayErrorCode.UNEXPECTED_ERROR,
            error: NO_CONTRACTS_ERROR,
            message: NO_CONTRACTS_ERROR,
          },
        });
        return;
      }

      // Open keys.coinbase.com for payment
      await writeContractsAsync({
        contracts: contractsRef.current,
        capabilities: {
          paymaster: isSponsored ? paymaster : null,
        },
      });
    } catch (error) {
      const isUserRejectedError =
        (error as Error).message?.includes('User denied connection request') ||
        isUserRejectedRequestError(error);
      const errorCode = isUserRejectedError
        ? PayErrorCode.USER_REJECTED_ERROR
        : PayErrorCode.UNEXPECTED_ERROR;
      const errorMessage = isUserRejectedError
        ? USER_REJECTED_ERROR
        : GENERIC_ERROR_MESSAGE;
      if (isUserRejectedError) {
        // Set the ref so that we can use the cached commerce API call
        userRejectedRef.current = true;
      }

      setErrorMessage(errorMessage);
      updateLifecycleStatus({
        statusName: PAY_LIFECYCLESTATUS.ERROR,
        statusData: {
          code: errorCode,
          error: JSON.stringify(error),
          message: errorMessage,
        },
      });
    }
  }, [
    address,
    chainId,
    chargeId,
    connectAsync,
    fetchData,
    isConnected,
    isSmartWallet,
    lifecycleStatus.statusData,
    lifecycleStatus.statusName,
    switchChainAsync,
    updateLifecycleStatus,
    writeContractsAsync,
  ]);

  const value = useValue({
    errorMessage,
    lifecycleStatus,
    onSubmit: handleSubmit,
    updateLifecycleStatus,
  });
  return <PayContext.Provider value={value}>{children}</PayContext.Provider>;
}
