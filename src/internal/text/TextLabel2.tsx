import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type TextLabel2React = {
  children: ReactNode;
  className?: string;
};

export function TextLabel2({ children, className }: TextLabel2React) {
  return (
    <span className={cn('text-sans text-sm leading-5', className)}>
      {children}
    </span>
  );
}
