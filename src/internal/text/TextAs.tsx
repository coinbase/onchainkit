import { createElement } from 'react';
import { cn } from '../../utils/cn';
import { textColorMap } from './textColorMap';
import type { TextReact } from './types';

type TextAsReact = {
  className: string;
  as: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
} & TextReact;

export function TextAs({
  as,
  children,
  className,
  variant = 'foreground',
  ...props
}: TextAsReact) {
  const textColor = textColorMap[variant];

  return createElement(
    as,
    { className: cn(className, textColor), ...props },
    children,
  );
}
