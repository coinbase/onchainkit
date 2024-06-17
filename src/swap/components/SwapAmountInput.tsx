import { useCallback, useContext, useEffect, useMemo } from 'react';

import { SwapContext } from '../context';
import { TextLabel1, TextLabel2 } from '../../internal/text';
import { TokenChip, TokenSelectDropdown } from '../../token';
import { cn } from '../../utils/cn';
import { TextInput } from '../../internal/form/TextInput';
import { useBalance, useReadContract } from 'wagmi';
import { isValidAmount } from '../../utils/isValidAmount';
import { getTokenBalances } from '../core/getTokenBalances';
import { erc20Abi } from 'viem';
import type { Address } from 'viem';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';
import type { SwapAmountInputReact } from '../types';
import type { Token } from '../../token';

export function SwapAmountInput({
  delayMs = 1000,
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

  // returns ETH balance
  const ethBalanceResponse: UseBalanceReturnType = useBalance({
    address,
  });

  // returns erc20 token balance
  const balanceResponse: UseReadContractReturnType = useReadContract({
    abi: erc20Abi,
    address: selectedToken?.address as Address,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!selectedToken?.address && !!address,
    },
  });

  const { convertedBalance, roundedBalance } = useMemo(() => {
    return getTokenBalances({
      ethBalance: ethBalanceResponse?.data?.formatted,
      tokenBalance: balanceResponse?.data as bigint,
      token: selectedToken,
    });
  }, [
    balanceResponse?.data,
    ethBalanceResponse?.data?.formatted,
    selectedToken,
  ]);

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
    if (!convertedBalance) {
      return;
    }
    setAmount?.(convertedBalance);
  }, [convertedBalance, setAmount]);

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token, setToken]);

  return (
    <div
      className={cn(
        'box-border flex w-full flex-col items-start',
        'rounded-md border-b border-solid bg-[#E5E7EB] p-4',
      )}
      data-testid="ockSwapAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <TextLabel2 className="text-gray-500">{label}</TextLabel2>
      </div>
      <div className="flex w-full items-center justify-between">
        <TextInput
          className="w-full border-[none] bg-transparent text-[2.5rem] text-display text-gray-900 text-sans leading-none outline-none"
          onChange={handleAmountChange}
          placeholder="0.0"
          value={amount}
          setValue={setAmount}
          delayMs={delayMs}
          inputValidator={isValidAmount}
        />
        {filteredTokens && (
          <TokenSelectDropdown
            options={filteredTokens}
            setToken={setToken}
            token={selectedToken}
          />
        )}
        {selectedToken && !filteredTokens && (
          <TokenChip token={selectedToken} />
        )}
      </div>
      <div className="mt-4 flex w-full justify-between">
        <TextLabel2>{''}</TextLabel2>
        <div className="flex items-center">
          {roundedBalance && (
            <TextLabel2 className="text-gray-500">{`Balance: ${roundedBalance}`}</TextLabel2>
          )}
          {type === 'from' && (
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center px-2 py-1"
              data-testid="ockSwapAmountInput_MaxButton"
              onClick={handleMaxButtonClick}
            >
              <TextLabel1 className="text-indigo-600">Max</TextLabel1>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
