import { useCallback, useState } from 'react';
import { Token } from '../../token';

type UseSelectSwapTokensHook = {
  userTokens: Token[];
  swappableTokens: Token[];
};

export function useSelectSwapTokens({ userTokens, swappableTokens }: UseSelectSwapTokensHook) {
  const [toToken, setToToken] = useState<Token | undefined>(userTokens?.[0]);
  const [fromToken, setFromToken] = useState<Token | undefined>();
  const [availableToTokens, setAvailableToTokens] = useState<Token[]>(userTokens);
  const [transactionDirection, setTransactionDirection] = useState<
    'USERTOKEN_AS_TOTOKEN' | 'SWAPPABLETOKEN_AS_TOTOKEN'
  >('USERTOKEN_AS_TOTOKEN');

  const handleSwitchTokens = useCallback(() => {
    const prevToToken = toToken;
    const prevFromToken = fromToken;

    setToToken(prevFromToken);
    setFromToken(prevToToken);

    if (transactionDirection === 'USERTOKEN_AS_TOTOKEN') {
      setTransactionDirection('SWAPPABLETOKEN_AS_TOTOKEN');
      setAvailableToTokens(swappableTokens);
    }

    if (transactionDirection === 'SWAPPABLETOKEN_AS_TOTOKEN') {
      setTransactionDirection('USERTOKEN_AS_TOTOKEN');
      setAvailableToTokens(userTokens);
    }
  }, [toToken, fromToken, availableToTokens, transactionDirection]);

  return {
    availableToTokens,
    handleSwitchTokens,
    toToken,
    fromToken,
    setToToken,
    setFromToken,
  };
}
