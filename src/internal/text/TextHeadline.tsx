import { ReactNode } from 'react';

type TextHeadlineReact = {
  children: ReactNode;
};

export function TextHeadline({ children }: TextHeadlineReact) {
  return (
    <span className="text-sans text-base leading-normal text-bold text-[#0A0B0D]">
      {children}
    </span>
  );
}
