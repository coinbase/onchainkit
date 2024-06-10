import { useCallback } from 'react';

import { SwapAmountInputReact } from '../types';
import { isValidAmount } from '../utils';
import { TokenSelector, TokenSelectorDropdown } from '../../token';

export function SwapAmountInput({
  token,
  swappableTokens,
  label,
  amount,
  tokenBalance,
  setAmount,
  setToken,
  disabled = false,
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
    <div data-testid="ockSwapAmountInput_Container" className="ock-swapamountinput-container">
      <div className="ock-swapamountinput-row">
        <label className="ock-swapamountinput-label">{label}</label>
        {tokenBalance && (
          <label className="ock-swapamountinput-balance">{`Balance: ${tokenBalance}`}</label>
        )}
      </div>
      <div className="ock-swapamountinput-row">
        <TokenSelector token={token} setToken={setToken}>
          <TokenSelectorDropdown setToken={setToken} options={swappableTokens} />
        </TokenSelector>
        <button
          data-testid="ockSwapAmountInput_MaxButton"
          className="ock-swapamountinput-maxbutton"
          onClick={handleMaxButtonClick}
          disabled={tokenBalance === undefined}
        >
          Max
        </button>
      </div>
      <input
        className="ock-swapamountinput-input"
        value={amount}
        onChange={handleAmountChange}
        placeholder="0"
        disabled={disabled}
        data-testid="ockSwapAmountInput_Input"
      />
    </div>
  );
}
