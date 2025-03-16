import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { useExchangeRate } from '@/internal/hooks/useExchangeRate';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { useValue } from '@/internal/hooks/useValue';
import { truncateDecimalPlaces } from '@/internal/utils/truncateDecimalPlaces';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { formatUnits } from 'viem';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import type {
  RecipientAddress,
  SendContextType,
  SendLifecycleStatus,
  SendProviderReact,
} from '../types';

const emptyContext = {} as SendContextType;

const SendContext = createContext(emptyContext);

export function useSendContext() {
  const sendContext = useContext(SendContext);
  if (sendContext === emptyContext) {
    throw new Error('useSendContext must be used within a SendProvider');
  }
  return sendContext;
}

export function SendProvider({ children }: SendProviderReact) {
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

  // lifecycle status
  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<SendLifecycleStatus>({
      statusName: 'init',
      statusData: {
        isMissingRequiredField: true,
      },
    });

  const hasSufficientBalance = useMemo(() => {
    if (!selectedToken) {
      return false;
    }

    if (selectedInputType === 'fiat') {
      return Number(fiatAmount) <= selectedToken.fiatBalance;
    }

    return (
      Number(cryptoAmount) <=
      Number(
        formatUnits(
          BigInt(selectedToken.cryptoBalance),
          selectedToken.decimals,
        ),
      )
    );
  }, [selectedInputType, selectedToken, cryptoAmount, fiatAmount]);

  // fetch & set ETH balance
  const { tokenBalances } = useWalletAdvancedContext();
  const ethHolding = tokenBalances?.find((token) => token.address === '');
  const ethBalance = ethHolding
    ? Number(formatUnits(BigInt(ethHolding.cryptoBalance), ethHolding.decimals))
    : 0;
  const isInitialized = ethBalance !== undefined;

  useEffect(() => {
    if (!ethBalance || ethBalance === 0) {
      updateLifecycleStatus({
        statusName: 'fundingWallet',
        statusData: {
          isMissingRequiredField: true,
        },
      });
      return;
    }

    updateLifecycleStatus({
      statusName: 'selectingAddress',
      statusData: {
        isMissingRequiredField: true,
      },
    });
  }, [ethBalance, updateLifecycleStatus]);

  // fetch & set exchange rate
  const { isLoading: exchangeRateLoading, exchangeRate } = useExchangeRate(
    {
      token: selectedToken?.address === '' ? 'ETH' : selectedToken?.address,
      selectedInputType,
    },
    RequestContext.Wallet,
  );

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
          sufficientBalance: hasSufficientBalance,
        },
      });
    },
    [updateLifecycleStatus, hasSufficientBalance],
  );

  const handleCryptoAmountChange = useCallback(
    (value: string) => {
      const truncatedValue = truncateDecimalPlaces(value, 8);
      setCryptoAmount(truncatedValue);
      updateLifecycleStatus({
        statusName: 'amountChange',
        statusData: {
          isMissingRequiredField: true,
          sufficientBalance: hasSufficientBalance,
        },
      });
    },
    [updateLifecycleStatus, hasSufficientBalance],
  );

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
  });

  return <SendContext.Provider value={value}>{children}</SendContext.Provider>;
}
