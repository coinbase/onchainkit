import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { background, border, cn, color } from '@/styles/theme';
import type { ReactNode } from 'react';
import { SendHeader } from './SendHeader';
import { SendProvider } from './SendProvider';
import { AddressInput } from '@/send/components/AddressInput';

type SendReact = {
  children?: ReactNode;
  className?: string;
};

export function Send({ children, className }: SendReact) {
  const componentTheme = useTheme();

  if (!children) {
    return (
      <SendProvider>
        <SendContent className={cn(componentTheme, className)}>
          <SendHeader />
          <AddressInput />
        </SendContent>
      </SendProvider>
    );
  }

  return (
    <SendProvider>
      <SendContent className={cn(componentTheme, className)}>
        {children}
      </SendContent>
    </SendProvider>
  );
}

function SendContent({ children, className }: SendReact) {
  return (
    <div
      className={cn(
        background.default,
        border.radius,
        border.lineDefault,
        color.foreground,
        'h-96 w-80',
        'flex flex-col',
        'p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
