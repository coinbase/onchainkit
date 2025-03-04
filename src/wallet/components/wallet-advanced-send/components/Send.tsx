import { Skeleton } from '@/internal/components/Skeleton';
import { background, border, cn, color } from '@/styles/theme';
import { ETH_REQUIRED_FOR_SEND } from '../constants';
import type { SendReact } from '../types';
// import { SendAddressSelection } from './SendAddressSelection';
// import { SendAmountInput } from './SendAmountInput';
// import { SendButton } from './SendButton';
import { SendFundWallet } from './SendFundWallet';
import { SendHeader } from './SendHeader';
import { SendProvider, useSendContext } from './SendProvider';
// import { SendTokenSelector } from './SendTokenSelector';

export function Send({
  children = <SendDefaultChildren />,
  className,
}: SendReact) {
  return (
    <SendProvider>
      <div
        data-testid="ockSend"
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
    </SendProvider>
  );
}

function SendDefaultChildren() {
  // const { ethBalance, isInitialized, selectedRecipientAddress, selectedToken } =
  const { ethBalance, isInitialized } = useSendContext();

  const walletHasEth = ethBalance > ETH_REQUIRED_FOR_SEND;

  console.log({ ethBalance, isInitialized, walletHasEth });

  if (!isInitialized) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <>
      <SendHeader />
      {walletHasEth ? (
        <div className="flex h-full flex-col justify-between gap-4">
          <div>This wallet has ETH. Test by changing to a wallet with no ETH.</div>
          {/* <div>
            <SendAddressSelection />
            {selectedRecipientAddress.value && !selectedToken && (
              <SendTokenSelector />
            )}
          </div> */}
          {/* {selectedRecipientAddress.value && selectedToken && (
            <>
              <SendAmountInput />
              <SendTokenSelector />
              <SendButton />
            </>
          )} */}
        </div>
      ) : (
        <SendFundWallet />
      )}
    </>
  );
}
