import { useMemo } from 'react';
import type { WithdrawDetailsReact } from '../types';
import { EarnDetails } from './EarnDetails';
import { useEarnContext } from './EarnProvider';

export function WithdrawDetails({ className }: WithdrawDetailsReact) {
  const { interestEarned, vaultToken } = useEarnContext();

  const tag = useMemo(() => {
    if (interestEarned) {
      return `${interestEarned} interest earned`;
    }
    return '';
  }, [interestEarned]);

  return <EarnDetails className={className} token={vaultToken} tag={tag} />;
}
