import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type TextTitle3React = {
  children: ReactNode;
  className?: string;
};

/* istanbul ignore next */
export function TextTitle3({ children, className }: TextTitle3React) {
  return (
    <span
      className={cn(
        'text-display text-gray-900 text-sans text-xl leading-7',
        className,
      )}
    >
      {children}
    </span>
  );
}
