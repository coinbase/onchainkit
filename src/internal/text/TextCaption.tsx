import type { ReactNode } from 'react';

type TextCaptionReact = {
  children: ReactNode;
};

/* istanbul ignore next */
export function TextCaption({ children }: TextCaptionReact) {
  return (
    <span className="text-bold text-sans text-xs leading-4">{children}</span>
  );
}
