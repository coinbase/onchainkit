import { Transaction, TransactionButton } from '@/transaction';
import { useEarnContext } from './EarnProvider';

export function EarnButton() {
  const { selectedTab } = useEarnContext();

  return (
    <Transaction calls={[{ to: '0x0000000000000000000000000000000000000000' }]}>
      <TransactionButton text={selectedTab} />
    </Transaction>
  );
}
