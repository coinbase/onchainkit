'use client';
import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { useTheme } from '@/internal/hooks/useTheme';
import { background, border, cn, color, text } from '@/styles/theme';
import type { AppchainBridgeReact } from '../types';
import { AppchainBridgeAddressInput } from './AppchainBridgeAddressInput';
import { AppchainBridgeInput } from './AppchainBridgeInput';
import { AppchainBridgeNetwork } from './AppchainBridgeNetwork';
import { AppchainBridgeProvider } from './AppchainBridgeProvider';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';
import { AppchainBridgeResumeTransaction } from './AppchainBridgeResumeTransaction';
import { AppchainBridgeSuccess } from './AppchainBridgeSuccess';
import { AppchainBridgeTransactionButton } from './AppchainBridgeTransactionButton';
import { AppchainBridgeWithdraw } from './AppchainBridgeWithdraw';
import { AppchainNetworkToggleButton } from './AppchainNetworkToggleButton';

const AppchainBridgeDefaultContent = ({ title }: { title: string }) => {
  const {
    isAddressModalOpen,
    isWithdrawModalOpen,
    isSuccessModalOpen,
    isResumeTransactionModalOpen,
    setIsResumeTransactionModalOpen,
  } = useAppchainBridgeContext();

  if (isResumeTransactionModalOpen) {
    return (
      <div
        className="relative flex min-h-60"
        data-testid="ockAppchainBridge_ResumeTransaction"
      >
        <div className="w-full">
          <AppchainBridgeResumeTransaction />
        </div>
      </div>
    );
  }

  if (isSuccessModalOpen) {
    return (
      <div
        className="relative flex min-h-60"
        data-testid="ockAppchainBridge_Success"
      >
        <div className="w-full">
          <AppchainBridgeSuccess />
        </div>
      </div>
    );
  }

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
        <div className="relative mb-4 flex items-center justify-between">
          <h3 className={cn(text.title3)} data-testid="ockSwap_Title">
            {title}
          </h3>
          <span
            className={cn(
              text.label2,
              color.foregroundMuted,
              'absolute right-0',
            )}
          >
            <button
              type="button"
              /* v8 ignore next 3 */
              onClick={() => {
                setIsResumeTransactionModalOpen(true);
              }}
            >
              Resume
            </button>
          </span>
        </div>
        <div className="relative flex flex-col gap-2">
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
  );
};

export function AppchainBridge({
  chain,
  appchain,
  title = 'Bridge',
  bridgeableTokens,
  children = <AppchainBridgeDefaultContent title={title} />,
  className,
  handleFetchPrice,
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
      handleFetchPrice={handleFetchPrice}
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
