import type { ReactNode } from 'react';

type TextLabel1React = {
  children: ReactNode;
  color?: string;
};

/* istanbul ignore next */
export function TextLabel1({ children, color = 'black' }: TextLabel1React) {
  return (
    <span className={`text-${color} font-bold text-sans text-sm leading-5`}>
      {children}
    </span>
  );
}
