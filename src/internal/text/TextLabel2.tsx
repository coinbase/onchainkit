import type { ReactNode } from 'react';

type TextLabel2React = {
  children: ReactNode;
};

/* istanbul ignore next */
export function TextLabel2({ children }: TextLabel2React) {
  return (
    <span className='text-[#0A0B0D] text-sans text-sm leading-5'>
      {children}
    </span>
  );
}
