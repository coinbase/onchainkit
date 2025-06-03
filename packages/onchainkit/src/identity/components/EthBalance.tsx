'use client';
import { useIdentityContext } from '@/identity/components/IdentityProvider';
import type { EthBalanceProps } from '@/identity/types';
import { getRoundedAmount } from '@/internal/utils/getRoundedAmount';
import { cn, text } from '../../styles/theme';
import { useGetETHBalance } from '../../wallet/hooks/useGetETHBalance';

export function EthBalance({ address, className }: EthBalanceProps) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error(
      'Address: an Ethereum address must be provided to the Identity or EthBalance component.',
    );
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { convertedBalance: balance, error } = useGetETHBalance(
    address ?? contextAddress,
  );

  if (!balance || error) {
    return null;
  }

  return (
    <span
      data-testid="ockEthBalance"
      className={cn(text.label2, 'text-ock-text-foreground-muted', className)}
    >
      {getRoundedAmount(balance, 4)} ETH
    </span>
  );
}
