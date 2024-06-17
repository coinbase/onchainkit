import type { ReactNode } from 'react';

type TextMessageReact = {
  children: ReactNode;
};

/* istanbul ignore next */
export function TextMessage({ children }: TextMessageReact) {
  return (
    <span className="font-normal text-gray-900 text-sm leading-tight">
      {children}
    </span>
  );
}
