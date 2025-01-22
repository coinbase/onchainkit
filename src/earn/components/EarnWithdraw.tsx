import { EarnWithdrawReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function EarnWithdraw({ children }: EarnWithdrawReact) {
  const { selectedTab } = useEarnContext();

  if (selectedTab !== 'Withdraw') {
    return null;
  }

  return <div className="flex flex-col p-4 gap-4">{children}</div>;
}
