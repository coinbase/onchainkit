import type { ReactNode } from 'react';

type TextBodyReact = {
  children: ReactNode;
};

export function TextBody({ children }: TextBodyReact) {
  return (
    <span className="text-base text-black text-sans leading-normal">
      {children}
    </span>
  );
}
