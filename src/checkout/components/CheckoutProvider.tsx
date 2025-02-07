import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { getWindowDimensions } from '@/internal/utils/getWindowDimensions';
import { openPopup } from '@/internal/utils/openPopup';
import { readContract } from '@wagmi/core';
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
import { useAccount, useConfig, useConnect, useSwitchChain } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useWriteContract } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { useWriteContracts } from 'wagmi/experimental';
import { useCallsStatus } from 'wagmi/experimental';
import { useValue } from '../../internal/hooks/useValue';
import { isUserRejectedRequestError } from '../../transaction/utils/isUserRejectedRequestError';
import { useOnchainKit } from '../../useOnchainKit';
import {
  GENERIC_ERROR_MESSAGE,
  NO_CONNECTED_ADDRESS_ERROR,
  NO_CONTRACTS_ERROR,
  USER_REJECTED_ERROR,
} from '../constants';
import { CHECKOUT_LIFECYCLESTATUS, CheckoutErrorCode } from '../constants';
import { useCommerceContracts } from '../hooks/useCommerceContracts';
import type {
  CheckoutContextType,
  CheckoutProviderReact,
  LifecycleStatus,
} from '../types';

const emptyContext = {} as CheckoutContextType;
export const CheckoutContext = createContext<CheckoutContextType>(emptyContext);

export function useCheckoutContext() {
  const context = useContext(CheckoutContext);
  if (context === emptyContext) {
    throw new Error(
      'useCheckoutContext must be used within a Checkout component',
    );
  }
  return context;
}

export function CheckoutProvider({
  chargeHandler,
  children,
  isSponsored,
  onStatus,
  productId,
}: CheckoutProviderReact) {
  // Core hooks
  const {
    config: { appearance, paymaster } = {
      appearance: { name: undefined, logo: undefined },
      paymaster: undefined,
    },
  } = useOnchainKit();
  const { address, chainId, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const [chargeId, setChargeId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [useExperimental, setUseExperimental] = useState(true);

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
        statusName: CHECKOUT_LIFECYCLESTATUS.FETCHING_DATA,
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
          statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
          statusData: {
            code: CheckoutErrorCode.UNEXPECTED_ERROR,
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
        statusName: CHECKOUT_LIFECYCLESTATUS.READY,
        statusData: {
          chargeId,
          contracts: contractsRef.current || [],
        },
      });
    },
    [chargeId],
  );

  // Component lifecycle
  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<LifecycleStatus>({
      statusName: CHECKOUT_LIFECYCLESTATUS.INIT,
      statusData: {},
    });

  // Transaction hooks
  const fetchContracts = useCommerceContracts({
    chargeHandler,
    productId,
  });

  // Add regular wagmi hooks as fallback
  const {
    writeContractAsync: writeContractRegular,
    status: writeContractStatus,
  } = useWriteContract();

  const wagmiConfig = useConfig();

  // Keep experimental hooks but make them conditional
  const { status: writeContractsStatus, writeContractsAsync } =
    useWriteContracts({
      /* v8 ignore start */
      mutation: {
        onSuccess: (id) => {
          setTransactionId(id);
        },
      },
      /* v8 ignore stop */
    });

  const { data: callsData } = useCallsStatus({
    id: transactionId,
    query: {
      /* v8 ignore next 3 */
      refetchInterval: (query) => {
        return query.state.data?.status === 'CONFIRMED' ? false : 1000;
      },
      enabled: !!transactionId && useExperimental,
    },
  });

  // Get transaction hash based on experimental or regular flow
  const transactionHash =
    callsData?.receipts?.[0]?.transactionHash ||
    (useExperimental ? undefined : (transactionId as `0x${string}`)); // In regular flow, transactionId will be the hash of the second transaction

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
    if (
      writeContractsStatus === 'pending' ||
      writeContractStatus === 'pending'
    ) {
      updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.PENDING,
        statusData: {},
      });
    }
  }, [writeContractsStatus, writeContractStatus, updateLifecycleStatus]);

  // Trigger success status when receipt is generated by useWaitForTransactionReceipt
  useEffect(() => {
    if (!receipt) {
      return;
    }
    updateLifecycleStatus({
      statusName: CHECKOUT_LIFECYCLESTATUS.SUCCESS,
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
      lifecycleStatus.statusName === CHECKOUT_LIFECYCLESTATUS.INIT &&
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
      if (lifecycleStatus.statusName === CHECKOUT_LIFECYCLESTATUS.SUCCESS) {
        window.open(
          `https://commerce.coinbase.com/pay/${chargeId}/receipt`,
          '_blank',
          'noopener,noreferrer',
        );
        return;
      }
      if (errorMessage === USER_REJECTED_ERROR) {
        // Reset status if previous request was a rejection
        setErrorMessage('');
      }

      let connectedAddress = address;
      let connectedChainId = chainId;
      if (!isConnected) {
        // Prompt for wallet connection
        // This is defaulted to Coinbase Smart Wallet
        fetchedDataHandleSubmit.current = true; // Set this here so useEffect does not run
        const { accounts, chainId: _connectedChainId } = await connectAsync({
          /* v8 ignore next 5 */
          connector: coinbaseWallet({
            appName: appearance?.name ?? undefined,
            appLogoUrl: appearance?.logo ?? undefined,
            preference: 'smartWalletOnly',
          }),
        });
        connectedAddress = accounts[0];
        connectedChainId = _connectedChainId;
      }

      // This shouldn't ever happen, but to make Typescript happy
      /* v8 ignore start */
      if (!connectedAddress) {
        setErrorMessage(GENERIC_ERROR_MESSAGE);
        updateLifecycleStatus({
          statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
          statusData: {
            code: CheckoutErrorCode.UNEXPECTED_ERROR,
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
        const { height, width } = getWindowDimensions('md');
        openPopup({
          url: `https://keys.coinbase.com/fund?asset=USDC&chainId=8453&presetCryptoAmount=${priceInUSDCRef.current}`,
          target: '_blank',
          height,
          width,
        });
        // Reset state
        insufficientBalanceRef.current = false;
        priceInUSDCRef.current = undefined;
        fetchedDataUseEffect.current = false;
        return;
      }

      // Contracts weren't successfully fetched from `fetchContracts`
      if (!contractsRef.current || contractsRef.current.length === 0) {
        setErrorMessage(GENERIC_ERROR_MESSAGE);
        updateLifecycleStatus({
          statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
          statusData: {
            code: CheckoutErrorCode.UNEXPECTED_ERROR,
            error: NO_CONTRACTS_ERROR,
            message: NO_CONTRACTS_ERROR,
          },
        });
        return;
      }

      if (useExperimental) {
        try {
          // Try experimental flow first
          await writeContractsAsync({
            contracts: contractsRef.current,
            capabilities: isSponsored
              ? {
                  paymasterService: {
                    url: paymaster,
                  },
                }
              : undefined,
          });
          return; // Exit if successful
        } catch {
          setUseExperimental(false);
          // Continue to regular flow
        }
      }

      // Regular flow - execute contracts sequentially
      let hash: string | undefined;
      for (const contract of contractsRef.current || []) {
        // Check if this is an approve call and if we already have sufficient allowance
        if (
          contract.functionName === 'approve' &&
          contract.args &&
          contract.args.length === 2 &&
          typeof contract.args[1] === 'bigint'
        ) {
          const currentAllowance = (await readContract(wagmiConfig, {
            address: contract.address,
            abi: contract.abi,
            functionName: 'allowance',
            args: [address as `0x${string}`, contract.args[0]],
          })) as bigint;
          // If we already have sufficient allowance, skip this approval
          if (currentAllowance >= contract.args[1]) {
            continue;
          }
        }

        hash = await writeContractRegular({
          address: contract.address,
          abi: contract.abi,
          functionName: contract.functionName,
          args: contract.args,
        });
      }
      if (hash) {
        setTransactionId(hash);
      }
    } catch (error) {
      const isUserRejectedError =
        (error as Error).message?.includes('User denied connection request') ||
        isUserRejectedRequestError(error);
      const errorCode = isUserRejectedError
        ? CheckoutErrorCode.USER_REJECTED_ERROR
        : CheckoutErrorCode.UNEXPECTED_ERROR;
      const errorMessage = isUserRejectedError
        ? USER_REJECTED_ERROR
        : GENERIC_ERROR_MESSAGE;
      if (isUserRejectedError) {
        userRejectedRef.current = true;
      }

      setErrorMessage(errorMessage);
      // Add this helper function at the top of the file, after imports
      function safeStringifyError(error: unknown): string {
        return JSON.stringify(error, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        );
      }

      updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
        statusData: {
          code: errorCode,
          error: safeStringifyError(error),
          message: errorMessage,
        },
      });
    }
  }, [
    address,
    appearance,
    chainId,
    chargeId,
    connectAsync,
    errorMessage,
    fetchData,
    isConnected,
    useExperimental,
    isSponsored,
    lifecycleStatus.statusName,
    paymaster,
    switchChainAsync,
    updateLifecycleStatus,
    wagmiConfig,
    writeContractsAsync,
    writeContractRegular,
  ]);

  const value = useValue({
    errorMessage,
    lifecycleStatus,
    onSubmit: handleSubmit,
    updateLifecycleStatus,
  });
  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}
