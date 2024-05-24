import { useCallback, useState } from 'react';
import { Token } from '../types';

const caretSVG = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.9501 4.60986L8.00014 9.55986L3.05014 4.60986L1.64014 6.02986L8.00014 12.3899L14.3601 6.02986L12.9501 4.60986Z"
      fill="#0A0B0D"
    />
  </svg>
);

type TokenBalanceProps = {
  fiatEstimate?: string;
};

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

type TokenSelectorProps = {
  selectedToken?: Token;
  onSelectTokenPress?: () => void;
};

// TODO: placeholder - will replace with TokenSelector from tokenkit
function TokenSelector({ selectedToken, onSelectTokenPress }: TokenSelectorProps) {
  return (
    <div
      style={{
        borderRadius: '2.5rem',
        padding: '0.5rem 0.75rem',
        background: 'white',
        boxShadow: '0 0.5rem 0.75rem 0 rgba(91, 97, 110, 0.12)',
        maxWidth: '12.5rem',
        display: 'flex',
        alignItems: 'center',
        minWidth: '6.25rem',
        fontSize: '1rem',
        justifyContent: 'center',
        maxHeight: '2rem',
        boxSizing: 'border-box',
      }}
    >
      {selectedToken ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <p>{selectedToken.currencyCode}</p>
          {caretSVG}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label>Select</label>
          {caretSVG}
        </div>
      )}
    </div>
  );
}

// checks that input is a number
function isValidAmount(value: string) {
  if (value.length > 11) return false;
  if (value === '') return true;
  const regex = /^[0-9]*\.?[0-9]*$/;
  return regex.test(value);
}

type AmountInputProps = {
  label: string;
  amount?: string;
  setAmount: (amount: string) => void;
  selectedToken?: Token;
  estimatedAmountInFiat?: string;
  disabled?: boolean;
};

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
        <TokenSelector selectedToken={selectedToken} />
      </div>
      {selectedToken && amount && <TokenBalance fiatEstimate={estimatedAmountInFiat} />}
    </div>
  );
}
