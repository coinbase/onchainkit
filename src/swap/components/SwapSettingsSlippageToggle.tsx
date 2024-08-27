import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageToggleReact } from '../types';

export function SwapSettingsSlippageToggle({
  className,
  customSlippageEnabled,
  onToggle,
}: SwapSettingsSlippageToggleReact) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 dark:border-gray-700 dark:bg-gray-950',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-1 rounded-xl border border-gray-300',
          'bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-950',
        )}
      >
        {['Auto', 'Custom'].map((option) => (
          <button
            key={option}
            type="button"
            className={cn(
              'flex-1 rounded-lg px-3 py-1 font-medium text-sm transition-colors',
              'dark:bg-gray-950 dark:text-gray-50',
              (option === 'Custom' && customSlippageEnabled) ||
                (option === 'Auto' && !customSlippageEnabled)
                ? 'bg-white text-blue-600 shadow-sm dark:bg-indigo-900'
                : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700',
            )}
            onClick={() => onToggle(option === 'Custom')}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
