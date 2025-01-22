import { background, cn } from '@/styles/theme';
import { EarnDepositReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function EarnDeposit({ children }: EarnDepositReact) {
  const { selectedTab } = useEarnContext();

  if (selectedTab !== 'Deposit') {
    return null;
  }

  return (
    <div className={cn('flex flex-col p-4 gap-4', background.default)}>
      {children}
    </div>
  );
}
