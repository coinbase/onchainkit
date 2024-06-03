import { memo, CSSProperties } from 'react';
import { Token } from '../../token';
import { CaretIcon } from './CaretIcon';
import { TokenSelectorProps } from '../types';

const styles = {
  container: {
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
  },
  selector: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  image: {
    height: '1rem',
    width: '1rem',
  },
  label: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#0A0B0D',
  },
} as Record<string, CSSProperties>;

export const TokenSelector = memo(function TokenSelectorComponent({
  token,
  onClick,
}: TokenSelectorProps) {
  return (
    <div style={styles.container} onClick={onClick} data-testid="TokenSelector">
      {token ? (
        <div style={styles.selector}>
          <img style={styles.image} src={token.image || ''} />
          <label style={styles.label}>{token.symbol}</label>
          <CaretIcon />
        </div>
      ) : (
        <div style={styles.selector}>
          <label style={styles.label}>Select</label>
          <CaretIcon />
        </div>
      )}
    </div>
  );
});
