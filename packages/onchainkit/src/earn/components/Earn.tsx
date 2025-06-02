'use client';
import { useTheme } from '@/internal/hooks/useTheme';
import { border, cn, text } from '@/styles/theme';
import type { EarnProps } from '../types';
import { EarnDeposit } from './EarnDeposit';
import { EarnProvider } from './EarnProvider';
import { useEarnContext } from './EarnProvider';
import { EarnWithdraw } from './EarnWithdraw';
import * as Tabs from '@radix-ui/react-tabs';

function EarnDefaultContent() {
  const { refetchWalletBalance, refetchDepositedBalance } = useEarnContext();

  return (
    <Tabs.Root defaultValue="deposit">
      <Tabs.List>
        <Tabs.Trigger
          value="deposit"
          onClick={refetchWalletBalance}
          className={cn(
            text.headline,
            'bg-ock-bg-default data-[state=active]:bg-ock-bg-primary',
            'text-ock-text-foreground data-[state=active]:text-ock-text-inverse',
            'w-1/2 text-center',
            'cursor-pointer px-3 py-2',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ock-text-foreground focus-visible:ring-inset',
          )}
        >
          Deposit
        </Tabs.Trigger>
        <Tabs.Trigger
          value="withdraw"
          onClick={refetchDepositedBalance}
          className={cn(
            text.headline,
            'bg-ock-bg-default data-[state=active]:bg-ock-bg-primary',
            'text-ock-text-foreground data-[state=active]:text-ock-text-inverse',
            'w-1/2 text-center',
            'cursor-pointer px-3 py-2',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ock-text-foreground focus-visible:ring-inset',
          )}
        >
          Withdraw
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="deposit"
        className={cn(
          border.lineDefault,
          '!border-l-0 !border-b-0 !border-r-0',
        )}
      >
        <EarnDeposit />
      </Tabs.Content>
      <Tabs.Content
        value="withdraw"
        className={cn(
          border.lineDefault,
          '!border-l-0 !border-b-0 !border-r-0',
        )}
      >
        <EarnWithdraw />
      </Tabs.Content>
    </Tabs.Root>
  );
}

export function Earn({
  children = <EarnDefaultContent />,
  className,
  vaultAddress,
  isSponsored,
  onError,
  onStatus,
  onSuccess,
}: EarnProps) {
  const componentTheme = useTheme();
  return (
    <EarnProvider
      vaultAddress={vaultAddress}
      isSponsored={isSponsored}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
    >
      <div
        className={cn(
          componentTheme,
          'flex w-[375px] flex-col overflow-hidden',
          'rounded-ock-default',
          border.lineDefault,
          className,
        )}
      >
        {children}
      </div>
    </EarnProvider>
  );
}
