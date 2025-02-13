import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { useTheme } from '@/internal/hooks/useTheme';
import { background, border, cn, color, text } from '@/styles/theme';
import type { AppchainBridgeReact } from '../types';
import { AppchainBridgeAddressInput } from './AppchainBridgeAddressInput';
import { AppchainBridgeInput } from './AppchainBridgeInput';
import { AppchainBridgeNetwork } from './AppchainBridgeNetwork';
import { AppchainBridgeProvider } from './AppchainBridgeProvider';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';
import { AppchainBridgeTransactionButton } from './AppchainBridgeTransactionButton';
import { AppchainBridgeWithdraw } from './AppchainBridgeWithdraw';
import { AppchainNetworkToggleButton } from './AppchainNetworkToggleButton';

const AppchainBridgeDefaultContent = ({
  title,
}: {
  title: string;
}) => {
  const { isAddressModalOpen, isWithdrawModalOpen } =
    useAppchainBridgeContext();

  if (isWithdrawModalOpen) {
    return (
      <div
        className="relative flex min-h-60"
        data-testid="ockAppchainBridge_Withdraw"
      >
        <div className="w-full">
          <AppchainBridgeWithdraw />
        </div>
      </div>
    );
  }

  if (isAddressModalOpen) {
    return (
      <div
        className="relative flex min-h-60"
        data-testid="ockAppchainBridge_Address"
      >
        <div className="w-full">
          <AppchainBridgeAddressInput />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-60"
      data-testid="ockAppchainBridge_DefaultContent"
    >
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h3 className={cn(text.title3)} data-testid="ockSwap_Title">
            {title}
          </h3>
        </div>
        <div className="relative flex">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-lg">
              <AppchainBridgeNetwork type="from" label="From" />
              <AppchainNetworkToggleButton />
              <AppchainBridgeNetwork type="to" label="To" />
            </div>
            <AppchainBridgeInput />
            <AppchainBridgeTransactionButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export function AppchainBridge({
  chain,
  appchain,
  title = 'Bridge',
  bridgeableTokens,
  children = <AppchainBridgeDefaultContent title={title} />,
  className,
}: AppchainBridgeReact) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();

  if (!isMounted) {
    return null;
  }

  return (
    <AppchainBridgeProvider
      chain={chain}
      appchain={appchain}
      bridgeableTokens={bridgeableTokens}
    >
      <div
        className={cn(
          componentTheme,
          background.default,
          border.radius,
          color.foreground,
          'ock-border-line-default flex w-full flex-col border px-6 pt-6 pb-4',
          className,
        )}
        data-testid="ockAppchainBridge_Container"
      >
        {children}
      </div>
    </AppchainBridgeProvider>
  );
}
