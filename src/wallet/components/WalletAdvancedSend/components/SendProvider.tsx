import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { useExchangeRate } from '@/internal/hooks/useExchangeRate';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { useSendTransaction } from '@/internal/hooks/useSendTransaction';
import { useValue } from '@/internal/hooks/useValue';
import { truncateDecimalPlaces } from '@/internal/utils/truncateDecimalPlaces';
import type { Call } from '@/transaction/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Address } from 'viem';
import { validateAddressInput } from '../../../utils/validateAddressInput';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import { useWalletContext } from '../../WalletProvider';
import type {
  SendContextType,
  SendLifecycleStatus,
  SendProviderReact,
} from '../types';

const emptyContext = {} as SendContextType;

const SendContext = createContext(emptyContext);

export function useSendContext() {
  return useContext(SendContext);
}

export function SendProvider({ children }: SendProviderReact) {
  const [isInitialized, setIsInitialized] = useState(false);

  // state for ETH balance
  const [ethBalance, setEthBalance] = useState<number>(0);

  // state for recipient address selection
  const [recipientInput, setRecipientInput] = useState<string | null>(null);
  const [validatedRecipientAddress, setValidatedRecipientAddress] =
    useState<Address | null>(null);
  const [selectedRecipientAddress, setSelectedRecipientAddress] =
    useState<Address | null>(null);

  // state for token selection
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

  // state for transaction data
  const [callData, setCallData] = useState<Call | null>(null);
  const [sendTransactionError, setSendTransactionError] = useState<
    string | null
  >(null);

  // data and utils from hooks
  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<SendLifecycleStatus>({
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
      updateLifecycleStatus({
        statusName: 'selectingAddress',
        statusData: {
          isMissingRequiredField: true,
        },
      });
    } else {
      updateLifecycleStatus({
        statusName: 'fundingWallet',
        statusData: {
          isMissingRequiredField: true,
        },
      });
    }
    setIsInitialized(true);
  }, [tokenBalances, updateLifecycleStatus]);

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

  // fetch & set exchange rate
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

  const handleRecipientInputChange = useCallback(
    (input: string) => {
      setRecipientInput(input);
      setSelectedRecipientAddress(null);
      setValidatedRecipientAddress(null);
      updateLifecycleStatus({
        statusName: 'selectingAddress',
        statusData: {
          isMissingRequiredField: true,
        },
      });
    },
    [updateLifecycleStatus],
  );

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
        statusName: 'amountChange',
        statusData: {
          isMissingRequiredField: true,
          sufficientBalance: false,
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
      statusName: 'selectingToken',
      statusData: {
        isMissingRequiredField: true,
      },
    });
  }, [updateLifecycleStatus]);

  const handleFiatAmountChange = useCallback(
    (value: string) => {
      setFiatAmount(value);
      updateLifecycleStatus({
        statusName: 'amountChange',
        statusData: {
          isMissingRequiredField: true,
          sufficientBalance:
            Number(value) <= Number(selectedToken?.fiatBalance),
        },
      });
    },
    [updateLifecycleStatus, selectedToken],
  );

  const handleCryptoAmountChange = useCallback(
    (value: string) => {
      const truncatedValue = truncateDecimalPlaces(value, 8);
      setCryptoAmount(truncatedValue);
      updateLifecycleStatus({
        statusName: 'amountChange',
        statusData: {
          isMissingRequiredField: true,
          sufficientBalance:
            Number(value) <=
            Number(selectedToken?.cryptoBalance) /
              10 ** Number(selectedToken?.decimals),
        },
      });
    },
    [updateLifecycleStatus, selectedToken],
  );

  const handleTransactionError = useCallback(
    (error: string) => {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: {
          error: 'Error building send transaction',
          code: 'SmSeBc01', // Send module SendButton component 01 error
          message: error,
        },
      });
      setSendTransactionError(error);
    },
    [updateLifecycleStatus],
  );

  const fetchTransactionData = useCallback(() => {
    if (!selectedRecipientAddress || !selectedToken || !cryptoAmount) {
      return;
    }

    try {
      setCallData(null);
      setSendTransactionError(null);
      const calls = useSendTransaction({
        recipientAddress: selectedRecipientAddress,
        token: selectedToken,
        amount: cryptoAmount,
      });
      if ('error' in calls) {
        handleTransactionError(calls.error);
      } else {
        setCallData(calls);
      }
    } catch (error) {
      handleTransactionError(error as string);
    }
  }, [
    selectedRecipientAddress,
    selectedToken,
    cryptoAmount,
    handleTransactionError,
  ]);

  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]);

  const value = useValue<SendContextType>({
    isInitialized,
    lifecycleStatus,
    updateLifecycleStatus,
    senderAddress,
    senderChain,
    tokenBalances,
    ethBalance,
    recipientInput,
    setRecipientInput,
    validatedRecipientAddress,
    selectedRecipientAddress,
    handleAddressSelection,
    selectedToken,
    handleRecipientInputChange,
    handleTokenSelection,
    handleResetTokenSelection,
    fiatAmount,
    handleFiatAmountChange,
    cryptoAmount,
    handleCryptoAmountChange,
    exchangeRate,
    exchangeRateLoading,
    selectedInputType,
    setSelectedInputType,
    callData,
    sendTransactionError,
  });

  return <SendContext.Provider value={value}>{children}</SendContext.Provider>;
}
