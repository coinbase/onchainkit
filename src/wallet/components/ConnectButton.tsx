import { cn, color, pressable, text as dsText } from '../../styles/theme';
import type { ConnectButtonReact } from '../types';

export function ConnectButton({
  className,
  connectButtonOnClick,
  text,
}: ConnectButtonReact) {
  return (
    <button
      type="button"
      data-testid="ConnectButton"
      className={cn(
        pressable.primary,
        dsText.headline,
        color.inverse,
        'inline-flex min-w-[153px] items-center justify-center rounded-xl px-4 py-3',
        className,
      )}
      onClick={() => connectButtonOnClick()}
    >
      <span className={cn(dsText.body, color.inverse)}>{text}</span>
    </button>
  );
}
