import { useCallback, useContext, useEffect, useMemo } from 'react';

import { SwapContext } from '../context';
import { TextLabel1, TextLabel2 } from '../../internal/text';
import { TokenChip } from '../../token';
import { cn } from '../../utils/cn';
import { Address, erc20Abi, formatUnits } from 'viem';
import { useBalance, useReadContract } from 'wagmi';
import { getRoundedAmount } from '../../utils/getRoundedAmount';
import { isValidAmount } from '../../utils/isValidAmount';
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
        'my-0.5 rounded-md border-b border-solid bg-[#E5E7EB] p-4',
      )}
      data-testid="ockSwapAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <TextLabel2>{label}</TextLabel2>
      </div>
      <div className="flex w-full items-center justify-between">
        <input
          className="w-full border-[none] bg-transparent text-5xl text-gray-500 outline-none"
          data-testid="ockSwapAmountInput_Input"
          onChange={handleAmountChange}
          placeholder="0.0"
          value={amount}
        />
        <TokenChip token={token} />
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
