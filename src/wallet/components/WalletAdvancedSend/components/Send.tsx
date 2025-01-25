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
import { TokenBalance } from '@/internal/components/TokenBalance';

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
          <AddressInput />
          {context.validatedRecipientAddress && (
            <AddressSelector address={context.validatedRecipientAddress} />
          )}
        </>
      );
    }

    if (!context.selectedToken) {
      return (
        <>
          <AddressInput />
          <TokenSelector />
        </>
      );
    }

    return (
      <div className='flex h-full flex-col justify-between'>
        <AddressInput />
        <SendAmountInput className="pb-2" />
        <TokenBalance
          token={context.selectedToken}
          amount={String(context.selectedToken?.cryptoBalance)}
          subtitle="Available to send"
          showAction={true}
          showImage={true}
          onActionPress={() => {
            console.log('clicked token');
          }}
        />
      </div>
    );
  }, [
    context.ethBalance,
    context.selectedRecipientAddress,
    context.selectedToken,
    context.validatedRecipientAddress,
  ]);

  return (
    <>
      <SendHeader />
      {activeStep}
    </>
  );
}
