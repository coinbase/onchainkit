import { CSSProperties } from 'react';
import { SwapTokensButtonProps } from '../types';
import { SwapIcon } from './SwapIcon';

const styles = {
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '3rem',
    width: '3rem',
    borderRadius: '50%',
    background: '#EEF0F3',
    border: '0.25rem solid white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
  },
} as Record<string, CSSProperties>;

export function SwapTokensButton({ onClick }: SwapTokensButtonProps) {
  return (
    <div style={styles.button} onClick={onClick} data-testid="SwapTokensButton">
      <SwapIcon />
    </div>
  );
}
