import { usdcToken } from '@/token/constants';
import { useMemo } from 'react';
import { EarnDetails } from './EarnDetails';
import { useEarnContext } from './EarnProvider';

export function WithdrawDetails() {
  const { interest } = useEarnContext();

  const tag = useMemo(() => {
    if (interest) {
      return `${interest} interest earned`;
    }
    return '';
  }, [interest]);

  // TODO: update token when we have logic to fetch vault info
  return <EarnDetails token={usdcToken} tag={tag} tagVariant="primary" />;
}
