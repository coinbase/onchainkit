import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { useCallback, useMemo } from 'react';
import type { DepositBalanceReact } from '../types';
import { EarnBalance } from './EarnBalance';
import { useEarnContext } from './EarnProvider';

export function DepositBalance({ className }: DepositBalanceReact) {
  const { convertedBalance, setDepositAmount } = useEarnContext();

  const handleMaxPress = useCallback(() => {
    if (convertedBalance) {
      setDepositAmount(convertedBalance);
    }
  }, [convertedBalance, setDepositAmount]);

  const roundedBalance = useMemo(() => {
    if (!convertedBalance) {
      return '0';
    }
    return getTruncatedAmount(convertedBalance.toString(), 6);
  }, [convertedBalance]);

  return (
    <EarnBalance
      className={className}
      title={`${roundedBalance} USDC`}
      subtitle="Available to deposit"
      onActionPress={handleMaxPress}
      showAction={!!convertedBalance}
    />
  );
}
