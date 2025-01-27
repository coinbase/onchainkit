import { usdcToken } from '@/token/constants';
import { useMemo } from 'react';
import type { DepositDetailsReact } from '../types';
import { EarnDetails } from './EarnDetails';
import { useEarnContext } from './EarnProvider';

export function DepositDetails({ className }: DepositDetailsReact) {
  const { apy } = useEarnContext();

  const tag = useMemo(() => {
    if (apy) {
      return `APY ${apy}`;
    }
    return '';
  }, [apy]);

  // TODO: update token when we have logic to fetch vault info
  return (
    <EarnDetails
      className={className}
      token={usdcToken}
      tag={tag}
      tagVariant="default"
    />
  );
}
