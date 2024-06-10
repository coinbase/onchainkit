import { useCallback } from 'react';

import { isValidAmount } from '../utils';
import { TokenSelector, TokenSelectorDropdown } from '../../token';
import type { SwapAmountInputReact } from '../types';

export function SwapAmountInput({
  amount,
  disabled = false,
  label,
  setAmount,
  setToken,
  swappableTokens,
  token,
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
    <div className="ock-swapamountinput-container" data-testid="ockSwapAmountInput_Container">
      <div className="ock-swapamountinput-row">
        <label className="ock-swapamountinput-label">{label}</label>
        {tokenBalance && (
          <label className="ock-swapamountinput-balance">{`Balance: ${tokenBalance}`}</label>
        )}
      </div>
      <div className="ock-swapamountinput-row">
        <TokenSelector setToken={setToken} token={token}>
          <TokenSelectorDropdown options={swappableTokens} setToken={setToken} />
        </TokenSelector>
        <button
          className="ock-swapamountinput-maxbutton"
          data-testid="ockSwapAmountInput_MaxButton"
          disabled={tokenBalance === undefined}
          onClick={handleMaxButtonClick}
        >
          Max
        </button>
      </div>
      <input
        className="ock-swapamountinput-input"
        data-testid="ockSwapAmountInput_Input"
        disabled={disabled}
        onChange={handleAmountChange}
        placeholder="0"
        value={amount}
      />
    </div>
  );
}
