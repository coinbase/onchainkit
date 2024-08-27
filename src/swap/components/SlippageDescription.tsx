import { cn, text } from '../../styles/theme';
import type { SlippageDescriptionReact } from '../types';

// Could update to be similar to ConnectWallet and take in a text param that defaults   text = 'lorem ipsum',
export function SlippageDescription({
  children,
  className,
}: SlippageDescriptionReact) {
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
