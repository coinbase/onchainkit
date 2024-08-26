import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageTitleReact } from '../types';

export function SwapSettingsSlippageTitle({
  children,
  className,
}: SwapSettingsSlippageTitleReact) {
  return (
    <h3
      className={cn(
        'mb-2 font-semibold text-base text-gray-950 leading-normal dark:text-gray-50',
        className,
      )}
    >
      {children}
    </h3>
  );
}
