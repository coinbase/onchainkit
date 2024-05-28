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
    <div data-testid="tokenRow" style={styles.row} onClick={() => onClick?.(token)}>
      <div style={styles.left}>
        {token.image === null ? (
          <div data-testid="noTokenImage" style={styles.circle} />
        ) : (
          <img data-testid="tokenImage" style={styles.image} src={token.image} />
        )}
        <div style={styles.column}>
          <div style={styles.label1}>{token.name}</div>
          <div style={styles.label2}>{token.symbol}</div>
        </div>
      </div>
      <div data-testid="tokenAmount" style={styles.label2}>
        {formatAmount(amount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: Number(amount) < 1 ? 5 : 2,
        })}
      </div>
    </div>
  );
});
