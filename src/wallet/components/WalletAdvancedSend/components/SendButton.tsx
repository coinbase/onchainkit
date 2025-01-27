import { border, cn, pressable } from '@/styles/theme';

export function SendButton() {
  return (
    <button
      type="button"
      className={cn(pressable.primary, border.radius, 'w-full px-4 py-2.5')}
      onClick={() => {
        console.log('tx button clicked');
      }}
    >
      Continue
    </button>
  );
}
