import { cn } from '../../styles/theme';
import type { SlippageLabelReact } from '../types';

// Could update to be similar to ConnectWallet and take in a text param that defaults   text =  Max. slippage
export function SlippageLabel({ children, className }: SlippageLabelReact) {
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
