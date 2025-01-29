import { useTheme } from '@/internal/hooks/useTheme';
import { background, border, cn, color } from '@/styles/theme';
import { useMemo, type ReactNode } from 'react';
import { SendHeader } from './SendHeader';
import { SendProvider, useSendContext } from './SendProvider';
import { SendAddressInput } from '@/wallet/components/WalletAdvancedSend/components/SendAddressInput';
import { SendAddressSelector } from '@/wallet/components/WalletAdvancedSend/components/SendAddressSelector';
import { SendTokenSelector } from '@/wallet/components/WalletAdvancedSend/components/SendTokenSelector';
import { SendAmountInput } from '@/wallet/components/WalletAdvancedSend/components/SendAmountInput';
import { SendFundingWallet } from '@/wallet/components/WalletAdvancedSend/components/SendFundingWallet';
import { SendButton } from '@/wallet/components/WalletAdvancedSend/components/SendButton';

type SendReact = {
  children?: ReactNode;
  className?: string;
};

export function Send({
  children = <SendDefaultChildren />,
  className,
}: SendReact) {
  const componentTheme = useTheme();

  return (
    <SendProvider>
      <div
        className={cn(
          componentTheme,
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
    </SendProvider>
  );
}

function SendDefaultChildren() {
  const context = useSendContext();

  console.log({
    context,
  });

  const activeStep = useMemo(() => {
    if (!context.ethBalance || context.ethBalance < 0.0000001) {
      return <SendFundingWallet />;
    }

    if (!context.selectedRecipientAddress) {
      return (
        <>
          <SendAddressInput />
          {context.validatedRecipientAddress && (
            <SendAddressSelector address={context.validatedRecipientAddress} />
          )}
        </>
      );
    }

    if (!context.selectedToken) {
      return (
        <>
          <SendAddressInput />
          <SendTokenSelector />
        </>
      );
    }

    return (
      <div className="flex h-full flex-col justify-between gap-4">
        <SendAddressInput />
        <SendAmountInput className="p-0" textClassName="text-4xl" />
        <SendTokenSelector />
        <SendButton />
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
