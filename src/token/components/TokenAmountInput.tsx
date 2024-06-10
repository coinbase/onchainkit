import { useCallback, CSSProperties, useEffect } from 'react';

import { TokenAmountInputReact } from '../types';
import { isValidAmount } from '../utils';
import { TokenSelector, TokenSelectorDropdown } from '../../token';

export function TokenAmountInput({
  label,
  amount,
  token,
  swappableTokens,
  tokenBalance,
  onMaxButtonClick,
  onAmountChange,
  onTokenSelectorClick,
  onSelectTokenToggle,
  disabled = false,
}: TokenAmountInputReact) {
  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isValidAmount(event.target.value)) {
        onAmountChange(event.target.value);
      }
    },
    [onAmountChange],
  );

  return (
    <div data-testid="ockTokenAmountInput_Container" className="ock-tokenamountinput-container">
      <div className="ock-tokenamountinput-row">
        <label className="ock-tokenamountinput-label">{label}</label>
        {tokenBalance && (
          <label className="ock-tokenamountinput-balance">{`Balance: ${tokenBalance}`}</label>
        )}
      </div>
      <div className="ock-tokenamountinput-row">
        <TokenSelector token={token} setToken={onTokenSelectorClick}>
          <TokenSelectorDropdown
            setToken={onTokenSelectorClick}
            onToggle={onSelectTokenToggle}
            options={swappableTokens}
          />
        </TokenSelector>
        <button className="ock-tokenamountinput-maxbutton" onClick={onMaxButtonClick}>
          Max
        </button>
      </div>
      <input
        className="ock-tokenamountinput-input"
        value={amount}
        onChange={handleAmountChange}
        placeholder="0"
        disabled={disabled}
        data-testid="ockTokenAmountInput_Input"
      />
    </div>
  );
}
