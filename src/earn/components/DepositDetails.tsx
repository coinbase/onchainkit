import { usdcToken } from '@/token/constants';
import { useMemo } from 'react';
import { EarnDetails } from './EarnDetails';
import { useEarnContext } from './EarnProvider';

export function DepositDetails() {
  const { apy } = useEarnContext();

  const tag = useMemo(() => {
    if (apy) {
      return `APY ${apy}`;
    }
    return '';
  }, [apy]);

  // TODO: update token when we have logic to fetch vault info
  return <EarnDetails token={usdcToken} tag={tag} tagVariant="default" />;
}
