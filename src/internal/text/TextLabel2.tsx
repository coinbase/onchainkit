import type { ReactNode } from 'react';

type TextLabel2React = {
  children: ReactNode;
  color?: string;
};

/* istanbul ignore next */
export function TextLabel2({ children, color = 'gray-500' }: TextLabel2React) {
  return (
    <span className={`text-${color} text-sans text-sm leading-5`}>
      {children}
    </span>
  );
}
