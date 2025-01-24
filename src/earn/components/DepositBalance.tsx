import { useCallback } from 'react';
import type { DepositBalanceReact } from '../types';
import { EarnBalance } from './EarnBalance';
import { useEarnContext } from './EarnProvider';

export function DepositBalance({ className }: DepositBalanceReact) {
  const { convertedBalance, setDepositAmount } = useEarnContext();

  const handleUseMaxPress = useCallback(() => {
    if (convertedBalance) {
      setDepositAmount(convertedBalance);
    }
  }, [convertedBalance, setDepositAmount]);

  return (
    <EarnBalance
      className={className}
      title={`${convertedBalance} USDC`}
      subtitle="Available to deposit"
      onActionPress={handleUseMaxPress}
      showAction={!!convertedBalance}
    />
  );
}
