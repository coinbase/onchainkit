import { useCallback, useContext, useEffect, useMemo } from 'react';

import { getRoundedAmount, isValidAmount } from '../utils';
import { TokenChip } from '../../token';
import { cn } from '../../utils/cn';
import { SwapContext } from '../context';
import { Address, erc20Abi, formatUnits } from 'viem';
import { useBalance, useReadContract } from 'wagmi';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';
import type { SwapAmountInputReact } from '../types';

export function SwapAmountInput({ label, token, type }: SwapAmountInputReact) {
  const {
    address,
    fromAmount,
    setFromAmount,
    setFromToken,
    setToAmount,
    setToToken,
    toAmount,
  } = useContext(SwapContext);

  const amount = useMemo(() => {
    if (type === 'to') {
      return toAmount;
    }
    return fromAmount;
  }, [type, toAmount, fromAmount]);

  const setAmount = useMemo(() => {
    if (type === 'to') {
      return setToAmount;
    }
    return setFromAmount;
  }, [type, setToAmount, setFromAmount]);

  const setToken = useMemo(() => {
    if (type === 'to') {
      return setToToken;
    }
    return setFromToken;
  }, [type, setFromToken, setToToken]);

  // returns ETH balance
  const ethBalanceResponse: UseBalanceReturnType = useBalance({
    address,
  });

  // returns non-eth token balance
  const balanceResponse: UseReadContractReturnType = useReadContract({
    abi: erc20Abi,
    address: token.address as Address,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!token?.address && !!address },
  });

  const convertedBalance = useMemo(() => {
    if (balanceResponse?.data) {
      return formatUnits(balanceResponse?.data as bigint, token?.decimals);
    }
  }, [balanceResponse, token]);

  const roundedBalance = useMemo(() => {
    if (
      ethBalanceResponse?.data?.formatted &&
      token?.address &&
      token?.symbol === 'ETH'
    ) {
      return getRoundedAmount(ethBalanceResponse?.data?.formatted, 8);
    }
    return convertedBalance;
  }, [ethBalanceResponse?.data, balanceResponse, token]);

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isValidAmount(event.target.value)) {
        setAmount?.(event.target.value);
      }
    },
    [setAmount],
  );

  const handleMaxButtonClick = useCallback(() => {
    if (ethBalanceResponse?.data?.formatted && token?.symbol === 'ETH') {
      setAmount?.(ethBalanceResponse?.data?.formatted);
    }
    if (convertedBalance) {
      setAmount?.(convertedBalance);
    }
  }, [convertedBalance, ethBalanceResponse?.data, setAmount]);

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token, setToken]);

  return (
    <div
      className={cn(
        'box-border flex w-full flex-col items-start',
        'gap-[11px] border-b border-solid bg-[#FFF] p-4',
      )}
      data-testid="ockSwapAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <label className="font-semibold text-[#030712] text-sm">{label}</label>
        {roundedBalance && (
          <label className="text-sm font-normal text-gray-400">{`Balance: ${roundedBalance}`}</label>
        )}
      </div>
      <div className="flex w-full items-center justify-between">
        <TokenChip token={token} />
        {type === 'from' && (
          <button
            className={cn(
              'flex h-8 w-[58px] max-w-[200px] items-center rounded-[40px]',
              'bg-gray-100 px-3 py-2 text-base font-medium',
              'not-italic leading-6 text-gray-500',
            )}
            data-testid="ockSwapAmountInput_MaxButton"
            disabled={roundedBalance === undefined}
            onClick={handleMaxButtonClick}
          >
            Max
          </button>
        )}
      </div>
      <input
        className="w-full border-[none] bg-transparent text-5xl text-[black]"
        data-testid="ockSwapAmountInput_Input"
        onChange={handleAmountChange}
        placeholder="0"
        value={amount}
      />
    </div>
  );
}
