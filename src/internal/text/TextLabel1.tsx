import { ReactNode } from 'react';

type TextLabel1React = {
  children: ReactNode;
};

/* istanbul ignore next */
export function TextLabel1({ children }: TextLabel1React) {
  return (
    <span className="text-sans text-bold text-sm leading-5 text-[#0A0B0D]">
      {children}
    </span>
  );
}
