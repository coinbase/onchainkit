import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { background, border, cn, color } from '@/styles/theme';
import type { ReactNode } from 'react';
import { SendHeader } from './SendHeader';
import { SendProvider, useSendContext } from './SendProvider';
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
        <SendContent className={cn(componentTheme, className)} />
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
  const {
    senderAddress,
    senderChain,
    tokenBalances,
    ethBalance,
    recipientInput,
    setRecipientInput,
    validatedRecipientAddress,
    selectedRecipientAddress,
  } = useSendContext();

  console.log({
    senderAddress,
    senderChain,
    tokenBalances,
    ethBalance,
    recipientInput,
    validatedRecipientAddress,
    selectedRecipientAddress,
  });

  if (!children) {
    return (
      <div
        className={cn(
          background.default,
          border.radius,
          border.lineDefault,
          color.foreground,
          'h-96 w-88',
          'flex flex-col',
          'p-4',
          className,
        )}
      >
        <SendHeader />
        <AddressInput
          addressInput={recipientInput}
          setAddressInput={setRecipientInput}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        background.default,
        border.radius,
        border.lineDefault,
        color.foreground,
        'h-96 w-88',
        'flex flex-col',
        'p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
