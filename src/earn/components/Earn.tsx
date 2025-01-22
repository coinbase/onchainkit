import { EarnProvider } from './EarnProvider';

import { EarnReact } from '../types';
import { border, cn } from '@/styles/theme';

export function Earn({ children, className }: EarnReact) {
  return (
    <EarnProvider>
      <div
        className={cn(
          'flex flex-col overflow-hidden',
          border.radius,
          border.lineDefault,
          className,
        )}
      >
        {children}
      </div>
    </EarnProvider>
  );
}
