import { Tab, TabContent, Tabs, TabsList } from '@/internal';
import { useTheme } from '@/internal/hooks/useTheme';
import { border, cn } from '@/styles/theme';
import type { EarnReact } from '../types';
import { EarnDeposit } from './EarnDeposit';
import { EarnProvider } from './EarnProvider';
import { useEarnContext } from './EarnProvider';
import { EarnWithdraw } from './EarnWithdraw';

function EarnDefaultContent() {
  const { refetchWalletBalance, refetchDepositedBalance } = useEarnContext();
  return (
    <Tabs defaultValue="deposit">
      <TabsList>
        <Tab value="deposit" onClick={refetchWalletBalance}>
          Deposit
        </Tab>
        <Tab value="withdraw" onClick={refetchDepositedBalance}>
          Withdraw
        </Tab>
      </TabsList>
      <TabContent
        value="deposit"
        className={cn(
          border.lineDefault,
          '!border-l-0 !border-b-0 !border-r-0',
        )}
      >
        <EarnDeposit />
      </TabContent>
      <TabContent
        value="withdraw"
        className={cn(
          border.lineDefault,
          '!border-l-0 !border-b-0 !border-r-0',
        )}
      >
        <EarnWithdraw />
      </TabContent>
    </Tabs>
  );
}

export function Earn({
  children = <EarnDefaultContent />,
  className,
  vaultAddress,
  isSponsored,
}: EarnReact) {
  const componentTheme = useTheme();
  return (
    <EarnProvider vaultAddress={vaultAddress} isSponsored={isSponsored}>
      <div
        className={cn(
          componentTheme,
          'flex w-[375px] flex-col overflow-hidden',
          border.radius,
          border.lineDefault,
          className,
        )}
      >
        {children}
      </div>
    </EarnProvider>
  );
}
