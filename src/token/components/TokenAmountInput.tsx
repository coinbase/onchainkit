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
  },
  label: {
    fontSize: '0.875rem',
    color: '#5B616E',
    paddingBottom: '0.25rem',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    marginBottom: 'auto',
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
      <div style={styles.inputContainer}>
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
    </div>
  );
}
