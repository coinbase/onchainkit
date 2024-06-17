import type { ReactNode } from 'react';
import clsx from 'clsx';

type TextTitle3React = {
  children: ReactNode;
  className?: string;
};

/* istanbul ignore next */
export function TextTitle3({ children, className }: TextTitle3React) {
  return (
    <span
      className={clsx(
        'text-display text-gray-900 text-sans text-xl leading-7',
        className,
      )}
    >
      {children}
    </span>
  );
}
