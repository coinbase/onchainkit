import { useCallback } from 'react';

import { isValidAmount } from '../utils';
import type { SwapAmountInputReact } from '../types';

export function SwapAmountInput({
  amount,
  disabled = false,
  label,
  setAmount,
  tokenBalance,
}: SwapAmountInputReact) {
  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isValidAmount(event.target.value)) {
        setAmount(event.target.value);
      }
    },
    [setAmount],
  );

  const handleMaxButtonClick = useCallback(() => {
    if (tokenBalance && isValidAmount(tokenBalance)) {
      setAmount(tokenBalance);
    }
  }, [tokenBalance, setAmount]);

  return (
    <div
      className="box-border flex w-fit flex-col items-start gap-[11px] bg-[#FFF] p-4"
      data-testid="ockSwapAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <label className="text-sm font-semibold text-[#030712]">{label}</label>
        {tokenBalance && (
          <label className="text-sm font-normal text-gray-400">{`Balance: ${tokenBalance}`}</label>
        )}
      </div>
      <div className="flex w-full items-center justify-between">
        {/* TODO: add back in when TokenSelector is complete */}
        {/* <TokenSelector setToken={setToken} token={token}>
          <TokenSelectorDropdown options={swappableTokens} setToken={setToken} />
        </TokenSelector> */}
        <button
          className="flex h-8 w-[58px] max-w-[200px] items-center rounded-[40px] bg-gray-100 px-3 py-2 text-base font-medium not-italic leading-6 text-gray-500"
          data-testid="ockSwapAmountInput_MaxButton"
          disabled={tokenBalance === undefined}
          onClick={handleMaxButtonClick}
        >
          Max
        </button>
      </div>
      <input
        className="border-[none] bg-transparent text-5xl text-[black]"
        data-testid="ockSwapAmountInput_Input"
        disabled={disabled}
        onChange={handleAmountChange}
        placeholder="0"
        value={amount}
      />
    </div>
  );
}
