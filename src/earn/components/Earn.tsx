import { EarnProvider } from './EarnProvider';
import type { EarnReact } from '../types';
import { border, cn } from '@/styles/theme';
import { Tabs, TabsList, Tab, TabContent } from '@/internal';
import { EarnWithdraw } from './EarnWithdraw';
import { EarnDeposit } from './EarnDeposit';

export function Earn({ children, className, vaultAddress }: EarnReact) {
  return (
    <EarnProvider vaultAddress={vaultAddress}>
      <div
        className={cn(
          'flex flex-col overflow-hidden w-[375px]',
          border.radius,
          border.lineDefault,
          className,
        )}
      >
        {children ? (
          children
        ) : (
          <Tabs defaultValue="deposit">
            <TabsList>
              <Tab value="deposit">Deposit</Tab>
              <Tab value="withdraw">Withdraw</Tab>
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
        )}
      </div>
    </EarnProvider>
  );
}
