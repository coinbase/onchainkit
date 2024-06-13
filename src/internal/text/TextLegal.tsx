import { ReactNode } from 'react';

type TextLegalReact = {
  children: ReactNode;
};

/* istanbul ignore next */
export function TextLegal({ children }: TextLegalReact) {
  return <span className="text-sans text-xs leading-4">{children}</span>;
}
