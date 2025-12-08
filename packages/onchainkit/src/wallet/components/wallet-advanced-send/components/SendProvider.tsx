import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { usePriceQuote } from '@/internal/hooks/usePriceQuote';
import { useValue } from '@/internal/hooks/useValue';
import { isApiError } from '@/internal/utils/isApiResponseError';
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
import { useAccount } from 'wagmi';
import { usePortfolio } from '../../../hooks/usePortfolio';
import type {
  SendContextType,
  SendLifecycleStatus,
  SendProviderReact,
} from '../types';
import { useRecipientState } from '../hooks/useRecipientState';

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
  // state for token selection
  const [selectedToken, setSelectedToken] =
    useState<PortfolioTokenWithFiatValue | null>(null);
  const [selectedInputType, setSelectedInputType] = useState<'fiat' | 'crypto'>(
    'crypto',
  );
  const [fiatAmount, setFiatAmount] = useState<string | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState<string | null>(null);

  const {
    recipientState,
    updateRecipientInput,
    validateRecipientInput,
    selectRecipient,
    deselectRecipient,
  } = useRecipientState();

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
  const { address } = useAccount();
  const { data: portfolioData } = usePortfolio(
    { address },
    RequestContext.Wallet,
  );
  const ethHolding = portfolioData?.tokenBalances?.find(
    (token) => token.address === '',
  );
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
  const { isLoading: exchangeRateLoading, data: exchangeRateData } =
    usePriceQuote(
      {
        token: selectedToken?.address === '' ? 'ETH' : selectedToken?.address,
      },
      RequestContext.Wallet,
    );
  const exchangeRate = useMemo(() => {
    if (
      !exchangeRateData ||
      isApiError(exchangeRateData) ||
      exchangeRateData.priceQuotes.length === 0
    ) {
      return 0;
    }

    return 1 / Number(exchangeRateData.priceQuotes[0].price);
  }, [exchangeRateData]);

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
    recipientState,
    updateRecipientInput,
    validateRecipientInput,
    selectRecipient,
    deselectRecipient,
    selectedToken,
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
