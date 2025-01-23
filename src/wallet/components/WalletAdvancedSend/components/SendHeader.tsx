import { cn, text } from '@/styles/theme';
import type { ReactNode } from 'react';

export function SendHeader({
  label = 'Send',
  leftContent,
  rightContent,
}: {
  label?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}) {
  return (
    <div className="mb-4 grid grid-cols-3 items-center">
      <div className="justify-self-start">{leftContent}</div>
      <div className={cn(text.headline, 'justify-self-center')}>{label}</div>
      <div className="justify-self-end">{rightContent}</div>
    </div>
  );
}
