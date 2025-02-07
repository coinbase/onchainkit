import { useTheme } from '@/internal/hooks/useTheme';
import { background, border, cn, color } from '@/styles/theme';
import type { ReactNode } from 'react';
import { SendAddressSelection } from './SendAddressSelection';
import { SendAmountInput } from './SendAmountInput';
import { SendButton } from './SendButton';
import { SendFundWallet } from './SendFundWallet';
import { SendHeader } from './SendHeader';
import { SendProvider, useSendContext } from './SendProvider';
import { SendTokenSelector } from './SendTokenSelector';

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

  const walletHasEth = context.isInitialized && context.ethBalance > 0.000001;

  console.log({
    context,
  });

  return (
    <>
      <SendHeader />
      {walletHasEth ? (
        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <SendAddressSelection />
            {context.selectedRecipientAddress.value &&
              !context.selectedToken && <SendTokenSelector />}
          </div>
          {context.selectedRecipientAddress.value && context.selectedToken && (
            <>
              <SendAmountInput />
              <SendTokenSelector />
              <SendButton />
            </>
          )}
        </div>
      ) : (
        <SendFundWallet />
      )}
    </>
  );
}
