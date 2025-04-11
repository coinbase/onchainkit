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
import type {
  RecipientState,
  SendContextType,
  SendLifecycleStatus,
  SendProviderReact,
} from '../types';
import { usePortfolio } from '@/wallet/hooks/usePortfolio';
import { useAccount } from 'wagmi';
import { getName } from '@/identity';
import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { base } from 'viem/chains';

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
  const [recipientState, setRecipientState] = useState<RecipientState>({
    phase: 'input',
    input: '',
    address: null,
    displayValue: null,
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

  useEffect(() => {
    if (recipientState.phase === 'selected') {
      getName({
        address: recipientState.address,
        chain: base,
      }).then((name) => {
        setRecipientState({
          phase: recipientState.phase,
          input: recipientState.input,
          address: recipientState.address,
          displayValue: name ?? getSlicedAddress(recipientState.address),
        });
      });
    }
  }, [recipientState.phase, recipientState.address, recipientState.input]);

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

  // handlers
  const handleRecipientInputChange = useCallback(() => {
    if (recipientState.phase === 'selected') {
      setRecipientState({
        phase: 'validated',
        input: recipientState.input,
        address: recipientState.address,
        displayValue: null,
      });
    } else {
      setRecipientState({
        ...recipientState,
        displayValue: null,
      });
    }
    updateLifecycleStatus({
      statusName: 'selectingAddress',
      statusData: {
        isMissingRequiredField: true,
      },
    });
  }, [recipientState, updateLifecycleStatus]);

  const handleAddressSelection = useCallback(
    async (selection: Extract<RecipientState, { phase: 'selected' }>) => {
      setRecipientState(selection);
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
    recipientState,
    setRecipientState,
    handleRecipientSelection: handleAddressSelection,
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
