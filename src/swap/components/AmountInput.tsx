import { useCallback, useState } from 'react';

import { TokenSelector } from './TokenSelector';
import { TokenBalanceProps, AmountInputProps } from '../types';
import { isValidAmount } from '../utils';

function TokenBalance({ fiatEstimate }: TokenBalanceProps) {
  // TODO: replace with actual balance
  const tokenBalance = 0.26;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        fontSize: '0.875rem',
        fontWeight: '400',
      }}
    >
      <p style={{ color: '#5B616E', margin: '0' }}>{`~$${fiatEstimate}`}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <p style={{ color: '#5B616E', margin: '0' }}>{`Balance: ${tokenBalance}`}</p>
        <div style={{ color: '#0052FF', fontWeight: '500', fontSize: '0.875rem' }}>Max</div>
      </div>
    </div>
  );
}

export function AmountInput({
  label,
  amount,
  setAmount,
  selectedToken,
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

  const handleTokenSelectClick = useCallback(() => {}, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '1rem',
        background: '#EEF0F3',
        padding: '1rem',
        width: '100%',
        boxSizing: 'border-box',
        height: '9rem',
        alignItems: 'flex-start',
      }}
    >
      <label
        style={{
          fontSize: '0.875rem',
          color: '#5B616E',
          paddingBottom: '0.25rem',
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: 'flex',
          width: '100%',
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          marginBottom: 'auto',
          alignItems: 'flex-end',
        }}
      >
        <input
          style={{
            fontSize: '2.5rem',
            border: 'none',
            background: 'none',
            outline: 'none',
            maxWidth: '18.75rem',
            color: 'black',
          }}
          value={amount}
          onChange={handleAmountChange}
          placeholder="0"
          disabled={disabled}
        />
        <TokenSelector token={selectedToken} onClick={handleTokenSelectClick} />
      </div>
      {selectedToken && amount && <TokenBalance fiatEstimate={estimatedAmountInFiat} />}
    </div>
  );
}
