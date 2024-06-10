import { useCallback, CSSProperties } from 'react';

import { TokenAmountInputReact } from '../types';
import { isValidAmount } from '../utils';
import { TokenSelector } from '../../token';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    background: '#EEF0F3',
    padding: '16px',
    width: 'fit-content',
    boxSizing: 'border-box',
    alignItems: 'flex-start',
    gap: '11px',
  },
  label: {
    fontSize: '0.875rem',
    color: '#030712',
    fontWeight: '600',
  },
  input: {
    fontSize: '2.5rem',
    border: 'none',
    background: 'none',
    outline: 'none',
    maxWidth: '18.75rem',
    color: 'black',
  },
} as Record<string, CSSProperties>;

export function TokenAmountInput({
  label,
  amount,
  onAmountChange,
  token,
  onTokenSelectorClick,
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
    <div style={styles.container} data-testid="ockTokenAmountInput_InputContainer">
      <label style={styles.label}>{label}</label>
      <TokenSelector token={token} onClick={onTokenSelectorClick} />
      <input
        style={styles.input}
        value={amount}
        onChange={handleAmountChange}
        placeholder="0"
        disabled={disabled}
        data-testid="ockTokenAmountInput_Input"
      />
    </div>
  );
}
