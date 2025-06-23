'use client';
import { useTheme } from '@/internal/hooks/useTheme';
import { border, cn, text } from '@/styles/theme';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { EarnProps } from '../types';
import { EarnDeposit } from './EarnDeposit';
import { EarnProvider } from './EarnProvider';
import { useEarnContext } from './EarnProvider';
import { EarnWithdraw } from './EarnWithdraw';

function EarnDefaultContent() {
  const { refetchWalletBalance, refetchDepositedBalance } = useEarnContext();

  return (
    <TabsPrimitive.Root defaultValue="deposit">
      <TabsPrimitive.List>
        <TabsPrimitive.Trigger
          value="deposit"
          onClick={refetchWalletBalance}
          className={cn(
            text.headline,
            'bg-ock-background data-[state=active]:bg-ock-primary',
            'text-ock-foreground data-[state=active]:text-ock-foreground-inverse',
            'w-1/2 text-center',
            'cursor-pointer px-3 py-2',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ock-foreground focus-visible:ring-inset',
          )}
        >
          Deposit
        </TabsPrimitive.Trigger>
        <TabsPrimitive.Trigger
          value="withdraw"
          onClick={refetchDepositedBalance}
          className={cn(
            text.headline,
            'bg-ock-background data-[state=active]:bg-ock-primary',
            'text-ock-foreground data-[state=active]:text-ock-foreground-inverse',
            'w-1/2 text-center',
            'cursor-pointer px-3 py-2',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ock-foreground focus-visible:ring-inset',
          )}
        >
          Withdraw
        </TabsPrimitive.Trigger>
      </TabsPrimitive.List>
      <TabsPrimitive.Content
        value="deposit"
        className={cn(
          border.lineDefault,
          '!border-l-0 !border-b-0 !border-r-0',
        )}
      >
        <EarnDeposit />
      </TabsPrimitive.Content>
      <TabsPrimitive.Content
        value="withdraw"
        className={cn(
          border.lineDefault,
          '!border-l-0 !border-b-0 !border-r-0',
        )}
      >
        <EarnWithdraw />
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
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
