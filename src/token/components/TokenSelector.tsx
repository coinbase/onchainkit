import { Token } from '../types';
import { TokenImage } from './TokenImage';

function CaretDown() {
  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.95 4.85999L8.00001 9.80999L3.05001 4.85999L1.64001 6.27999L8.00001 12.64L14.36 6.27999L12.95 4.85999Z"
        fill="#0A0B0D"
      />
    </svg>
  );
}

const styles = {
  button: {
    borderRadius: '16px',
    padding: '4px 12px 4px 12px',
    display: 'flex',
    alignItems: 'center',
    background: '#EEF0F3',
    width: 'fit-content',
  },
  image: {
    height: '16px',
    width: '16px',
  },
  label: {
    color: '#0A0B0D',
    fontSize: '16px',
    lineHeight: '1.5',
    fontWeight: '500',
    marginLeft: '4px',
  },
  caret: {
    marginLeft: '8px',
  },
};

type TokenSelectorReact = {
  token?: Token;
  onClick: () => void;
};

export function TokenSelector({ token, onClick }: TokenSelectorReact) {
  return (
    <button data-testid="ockTokenSelector_Button" style={styles.button} onClick={onClick}>
      {token ? (
        <>
          <TokenImage src={token.image} size={16} />
          <span data-testid="ockTokenSelector_Symbol" style={styles.label}>
            {token.symbol}
          </span>
        </>
      ) : (
        <span style={styles.label}>Select</span>
      )}
      <span style={styles.caret}>
        <CaretDown />
      </span>
    </button>
  );
}
