import { Skeleton } from '@/internal/components/Skeleton';
import { useTheme } from '@/internal/hooks/useTheme';
import { background, border, cn, color } from '@/styles/theme';
import type { ReactNode } from 'react';
import { ETH_REQUIRED_FOR_SEND } from '../constants';
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
  const { ethBalance, isInitialized, selectedRecipientAddress, selectedToken } =
    useSendContext();

  const walletHasEth = ethBalance > ETH_REQUIRED_FOR_SEND;

  if (!isInitialized) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <>
      <SendHeader />
      {walletHasEth ? (
        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <SendAddressSelection />
            {selectedRecipientAddress.value && !selectedToken && (
              <SendTokenSelector />
            )}
          </div>
          {selectedRecipientAddress.value && selectedToken && (
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
