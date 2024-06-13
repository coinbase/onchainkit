import type { ReactNode } from 'react';

type TextHeadlineReact = {
  children: ReactNode;
};

export function TextHeadline({ children }: TextHeadlineReact) {
  return (
    <span className='text-[#0A0B0D] text-base text-bold text-sans leading-normal'>
      {children}
    </span>
  );
}
