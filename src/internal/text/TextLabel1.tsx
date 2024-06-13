import type { ReactNode } from 'react';

type TextLabel1React = {
  children: ReactNode;
};

/* istanbul ignore next */
export function TextLabel1({ children }: TextLabel1React) {
  return (
    <span className='text-[#0A0B0D] text-bold text-sans text-sm leading-5'>
      {children}
    </span>
  );
}
