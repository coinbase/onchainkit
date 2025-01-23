import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { background, border, cn, color } from '@/styles/theme';
import type { ReactNode } from 'react';
import { SendHeader } from './SendHeader';
import { SendProvider, useSendContext } from './SendProvider';
import { AddressInput } from '@/wallet/components/WalletAdvancedSend/components/AddressInput';
import { AddressSelector } from '@/wallet/components/WalletAdvancedSend/components/AddressSelector';
import { TokenSelector } from '@/wallet/components/WalletAdvancedSend/components/TokenSelector';

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
  const context = useSendContext();

  console.log({
    context,
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
          'flex flex-col items-center',
          'p-4',
          className,
        )}
      >
        <SendHeader />
        {context.lifecycleStatus.statusName !== 'init' && (
          <AddressInput
            addressInput={context.recipientInput}
            setAddressInput={context.setRecipientInput}
          />
        )}
        <AddressSelector />
        <TokenSelector />
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
