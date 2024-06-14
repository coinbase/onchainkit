import { useCallback, useContext, useEffect, useMemo } from 'react';

import { SwapContext } from '../context';
import { TextLabel1, TextLabel2 } from '../../internal/text';
import { TokenChip, TokenSelectDropdown } from '../../token';
import { cn } from '../../utils/cn';
import { getRoundedAmount } from '../../utils/getRoundedAmount';
import { isValidAmount } from '../../utils/isValidAmount';
import { useBalance } from 'wagmi';
import type { SwapAmountInputReact } from '../types';
import type { UseBalanceReturnType } from 'wagmi';
import type { Token } from '../../token';
import { TextInput } from '../../internal/form/TextInput';

export function SwapAmountInput({
  label,
  token,
  type,
  swappableTokens,
}: SwapAmountInputReact) {
  const {
    address,
    fromAmount,
    fromToken,
    handleFromAmountChange,
    handleToAmountChange,
    setFromAmount,
    setFromToken,
    setToAmount,
    setToToken,
    toAmount,
    toToken,
  } = useContext(SwapContext);

  const { amount, setAmount, handleAmountChange, setToken, selectedToken } =
    useMemo(() => {
      if (type === 'to') {
        return {
          amount: toAmount,
          selectedToken: toToken,
          setAmount: setToAmount,
          setToken: setToToken,
          handleAmountChange: handleToAmountChange,
        };
      }
      return {
        amount: fromAmount,
        selectedToken: fromToken,
        setAmount: setFromAmount,
        setToken: setFromToken,
        handleAmountChange: handleFromAmountChange,
      };
    }, [
      fromAmount,
      fromToken,
      handleFromAmountChange,
      handleToAmountChange,
      setFromAmount,
      setFromToken,
      setToAmount,
      setToToken,
      toAmount,
      toToken,
      type,
    ]);

  const balanceResponse: UseBalanceReturnType = useBalance({
    address,
    ...(token?.address && { token: token.address }),
  });

  const roundedBalance = useMemo(() => {
    if (balanceResponse?.data?.formatted && token?.address) {
      return getRoundedAmount(balanceResponse?.data?.formatted, 8);
    }
  }, [balanceResponse?.data, token]);

  // we are mocking the token selectors so i'm not able
  // to test this since the components aren't actually rendering
  /* istanbul ignore next */
  const filteredTokens = useMemo(() => {
    if (type === 'to') {
      return swappableTokens?.filter(
        (t: Token) => t.symbol !== fromToken?.symbol,
      );
    }
    return swappableTokens?.filter((t: Token) => t.symbol !== toToken?.symbol);
  }, [fromToken, swappableTokens, toToken, type]);

  const handleMaxButtonClick = useCallback(() => {
    if (balanceResponse?.data?.formatted) {
      setAmount?.(balanceResponse?.data?.formatted);
    }
  }, [balanceResponse?.data, setAmount]);

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token, setToken]);

  return (
    <div
      className={cn(
        'box-border flex w-full flex-col items-start',
        'my-0.5 rounded-md border-b border-solid bg-[#E5E7EB] p-4',
      )}
      data-testid="ockSwapAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <TextLabel2>{label}</TextLabel2>
      </div>
      <div className="flex w-full items-center justify-between">
        <TextInput
          className="w-full border-[none] bg-transparent text-5xl text-gray-500 outline-none"
          data-testid="ockSwapAmountInput_Input"
          onChange={handleAmountChange}
          placeholder="0.0"
          value={amount}
          setValue={setAmount}
          delayMs={200}
          inputValidator={isValidAmount}
        />
        {filteredTokens && (
          <TokenSelectDropdown
            options={filteredTokens}
            setToken={setToken}
            token={selectedToken}
          />
        )}
        {token && !filteredTokens && <TokenChip token={token} />}
      </div>
      <div className="mt-4 flex w-full justify-between">
        <TextLabel2>~$0.0</TextLabel2>
        <div>
          {roundedBalance && (
            <TextLabel2>{`Balance: ${roundedBalance}`}</TextLabel2>
          )}
          {type === 'from' && (
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center px-2 py-1"
              data-testid="ockSwapAmountInput_MaxButton"
              disabled={roundedBalance === undefined}
              onClick={handleMaxButtonClick}
            >
              <TextLabel1 color="#4F46E5">Max</TextLabel1>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
