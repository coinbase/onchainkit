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
import { formatUnits } from 'viem';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import type {
  SendContextType,
  SendLifecycleStatus,
  SendProviderReact,
  RecipientAddress,
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
  const [selectedRecipientAddress, setSelectedRecipientAddress] =
    useState<RecipientAddress>({
      display: '',
      value: null,
    });

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

  // lifecycle status
  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<SendLifecycleStatus>({
      statusName: 'init',
      statusData: {
        isMissingRequiredField: true,
      },
    });

  // fetch & set ETH balance
  const { tokenBalances } = useWalletAdvancedContext();
  useEffect(() => {
    const ethBalance = tokenBalances?.find((token) => token.address === '');
    if (ethBalance && ethBalance.cryptoBalance > 0) {
      setEthBalance(
        Number(
          formatUnits(BigInt(ethBalance.cryptoBalance), ethBalance.decimals),
        ),
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

  // handlers
  const handleRecipientInputChange = useCallback(() => {
    setSelectedRecipientAddress({
      display: '',
      value: null,
    });
    updateLifecycleStatus({
      statusName: 'selectingAddress',
      statusData: {
        isMissingRequiredField: true,
      },
    });
  }, [updateLifecycleStatus]);

  const handleAddressSelection = useCallback(
    async (selection: RecipientAddress) => {
      setSelectedRecipientAddress(selection);
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
            Number(
              formatUnits(
                BigInt(selectedToken?.cryptoBalance ?? 0),
                selectedToken?.decimals ?? 0,
              ),
            ),
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
    },
    [updateLifecycleStatus],
  );

  const fetchTransactionData = useCallback(() => {
    if (!selectedRecipientAddress.value || !selectedToken || !cryptoAmount) {
      return;
    }

    try {
      setCallData(null);
      const calls = useSendTransaction({
        recipientAddress: selectedRecipientAddress.value,
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
    ethBalance,
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
  });

  return <SendContext.Provider value={value}>{children}</SendContext.Provider>;
}
