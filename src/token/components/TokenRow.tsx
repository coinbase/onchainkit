import { memo, CSSProperties } from 'react';
import { TokenRowReact } from '../types';
import { formatAmount } from '../core/formatAmount';

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '4px 8px',
    width: '100%',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    height: '32px',
    width: '32px',
    marginRight: '12px',
  },
  circle: {
    height: '32px',
    width: '32px',
    borderRadius: '99999px',
    background: 'gray',
    marginRight: '12px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label1: {
    fontSize: '16px',
    lineHeight: '1.5',
    fontWeight: 500,
    color: '#0A0B0D',
  },
  label2: {
    fontSize: '16px',
    lineHeight: '1.5',
    fontWeight: 400,
    color: '#5B616E',
  },
} as Record<string, CSSProperties>;

export const TokenRow = memo(function TokenRow({ token, amount, onClick }: TokenRowReact) {
  return (
    <button data-testid="ockTokenRow_Container" style={styles.row} onClick={() => onClick?.(token)}>
      <span style={styles.left}>
        {token.image === null ? (
          <span data-testid="ockTokenRow_PlaceholderImage" style={styles.circle} />
        ) : (
          <img data-testid="ockTokenRow_Image" style={styles.image} src={token.image} />
        )}
        <span style={styles.column}>
          <span style={styles.label1}>{token.name}</span>
          <span style={styles.label2}>{token.symbol}</span>
        </span>
      </span>
      <span data-testid="ockTokenRow_Amount" style={styles.label2}>
        {formatAmount(amount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: Number(amount) < 1 ? 5 : 2,
        })}
      </span>
    </button>
  );
});
