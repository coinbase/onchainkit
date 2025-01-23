import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { background, border, cn, color } from '@/styles/theme';
import { useMemo, type ReactNode } from 'react';
import { SendHeader } from './SendHeader';
import { SendProvider, useSendContext } from './SendProvider';
import { AddressInput } from '@/wallet/components/WalletAdvancedSend/components/AddressInput';
import { AddressSelector } from '@/wallet/components/WalletAdvancedSend/components/AddressSelector';
import { TokenSelector } from '@/wallet/components/WalletAdvancedSend/components/TokenSelector';
import { SendAmountInput } from '@/wallet/components/WalletAdvancedSend/components/SendAmountInput';
import { SendFundingWallet } from '@/wallet/components/WalletAdvancedSend/components/SendFundingWallet';

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

function SendContent({
  children = <SendDefaultChildren />,
  className,
}: SendReact) {
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

function SendDefaultChildren() {
  const context = useSendContext();

  console.log({
    context,
  });

  const activeStep = useMemo(() => {
    if (!context.ethBalance) {
      return <SendFundingWallet />;
    }

    if (!context.selectedRecipientAddress) {
      return (
        <>
          <AddressInput
            addressInput={context.recipientInput}
            setAddressInput={context.setRecipientInput}
          />
          <AddressSelector />
        </>
      );
    }

    if (!context.selectedToken) {
      return (
        <>
          <AddressInput
            addressInput={context.recipientInput}
            setAddressInput={context.setRecipientInput}
          />
          <TokenSelector />
        </>
      );
    }

    return <SendAmountInput />;
  }, [
    context.ethBalance,
    context.selectedRecipientAddress,
    context.selectedToken,
    context.recipientInput,
    context.setRecipientInput,
  ]);

  return (
    <>
      <SendHeader />
      {activeStep}
    </>
  );
}
