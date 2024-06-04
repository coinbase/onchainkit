import { useCallback, CSSProperties } from 'react';

import { TokenSelectorButton } from './TokenSelectorButton';
import { TokenBalanceProps, AmountInputProps } from '../types';
import { isValidAmount } from '../utils';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '1rem',
    background: '#EEF0F3',
    padding: '1rem',
    width: '100%',
    boxSizing: 'border-box',
    height: '9rem',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: '0.875rem',
    color: '#5B616E',
    paddingBottom: '0.25rem',
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    marginBottom: 'auto',
    alignItems: 'flex-end',
  },
  input: {
    fontSize: '2.5rem',
    border: 'none',
    background: 'none',
    outline: 'none',
    maxWidth: '18.75rem',
    color: 'black',
  },
  balanceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '0.875rem',
    fontWeight: '400',
  },
  row: { display: 'flex', alignItems: 'center', gap: '0.25rem' },
  estimate: { color: '#5B616E', margin: '0' },
  balance: { color: '#5B616E', margin: '0' },
  maxButton: { color: '#0052FF', fontWeight: '500', fontSize: '0.875rem' },
} as Record<string, CSSProperties>;

function TokenBalance({ fiatEstimate, onMaxButtonClick }: TokenBalanceProps) {
  // TODO: replace with actual balance
  const tokenBalance = 0.26;

  return (
    <div style={styles.balanceContainer}>
      <p style={styles.estimate}>{`~$${fiatEstimate}`}</p>
      <div style={styles.row}>
        <p style={styles.balance}>{`Balance: ${tokenBalance}`}</p>
        <div onClick={onMaxButtonClick} style={styles.maxButton}>
          Max
        </div>
      </div>
    </div>
  );
}

export function AmountInput({
  label,
  amount,
  setAmount,
  selectedToken,
  selectTokenClick,
  estimatedAmountInFiat,
  disabled = false,
}: AmountInputProps) {
  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isValidAmount(event.target.value)) {
        setAmount(event.target.value);
      }
    },
    [setAmount],
  );

  const handleMaxButtonClick = useCallback(() => {
    // TODO: add functionality
  }, []);

  return (
    <div style={styles.container} data-testid="AmountInput">
      <label style={styles.label}>{label}</label>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={amount}
          onChange={handleAmountChange}
          placeholder="0"
          disabled={disabled}
          data-testid="AmountInput_input"
        />
        <TokenSelectorButton token={selectedToken} onClick={selectTokenClick} />
      </div>
      {selectedToken && amount && (
        <TokenBalance
          token={selectedToken}
          onMaxButtonClick={handleMaxButtonClick}
          fiatEstimate={estimatedAmountInFiat}
        />
      )}
    </div>
  );
}
