import type { ReactNode } from 'react';

type TextTitle3React = {
  children: ReactNode;
};

/* istanbul ignore next */
export function TextTitle3({ children }: TextTitle3React) {
  return (
    <span className="text-display text-gray-900 text-sans text-xl leading-7">
      {children}
    </span>
  );
}
