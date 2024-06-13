import { ReactNode } from 'react';

type TextLegalReact = {
  children: ReactNode;
};

export function TextLegal({ children }: TextLegalReact) {
  return <span className="text-sans text-xs leading-4">{children}</span>;
}
