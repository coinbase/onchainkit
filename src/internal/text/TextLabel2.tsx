import type { ReactNode } from 'react';

type TextLabel2React = {
  children: ReactNode;
};

export function TextLabel2({ children }: TextLabel2React) {
  return (
    <span className="text-gray-500 text-sans text-sm leading-5">
      {children}
    </span>
  );
}
