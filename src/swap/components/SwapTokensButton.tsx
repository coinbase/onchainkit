import { SwapTokensButtonProps } from '../types';
import { SwapIcon } from './SwapIcon';

export function SwapTokensButton({ onClick }: SwapTokensButtonProps) {
  return (
    <div
      style={{
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
      }}
      onClick={onClick}
    >
      <SwapIcon />
    </div>
  );
}
