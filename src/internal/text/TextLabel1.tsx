import type { ReactNode } from 'react';

type TextLabel1React = {
  children: ReactNode;
  color?: string;
};

/* istanbul ignore next */
export function TextLabel1({ children, color = '#0A0B0D' }: TextLabel1React) {
  return (
    <span className={`text-[${color}] text-bold text-sans text-sm leading-5`}>
      {children}
    </span>
  );
}
