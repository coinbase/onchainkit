import { ReactNode } from 'react';

type TextCaptionReact = {
  children: ReactNode;
};

export function TextCaption({ children }: TextCaptionReact) {
  return (
    <span className="text-sans text-bold text-xs leading-4">{children}</span>
  );
}
