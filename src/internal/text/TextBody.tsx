import { ReactNode } from 'react';

type TextBodyReact = {
  children: ReactNode;
};

export function TextBody({ children }: TextBodyReact) {
  return (
    <span className="text-sans text-base leading-normal text-black">
      {children}
    </span>
  );
}
