import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type TextLabel1React = {
  children: ReactNode;
  className: string;
};

/* istanbul ignore next */
export function TextLabel1({ children, className }: TextLabel1React) {
  return (
    <span className={cn('font-bold text-sans text-sm leading-5', className)}>
      {children}
    </span>
  );
}
