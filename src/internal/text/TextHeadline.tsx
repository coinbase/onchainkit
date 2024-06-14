import type { ReactNode } from 'react';

type TextHeadlineReact = {
  children: ReactNode;
  color?: string;
};

export function TextHeadline({ children, color = 'black' }: TextHeadlineReact) {
  return (
    <span
      className={`text-${color} text-base text-bold text-sans leading-normal`}
    >
      {children}
    </span>
  );
}
