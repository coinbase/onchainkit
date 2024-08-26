import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageDescriptionReact } from '../types';

export function SwapSettingsSlippageDescription({
  children,
  className,
}: SwapSettingsSlippageDescriptionReact) {
  return (
    <p
      className={cn(
        'mb-2 font-normal font-sans text-gray-600 text-xs leading-4 dark:text-gray-400"',
        className,
      )}
    >
      {children}
    </p>
  );
}
