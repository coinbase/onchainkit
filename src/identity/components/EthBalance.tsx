import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import { cn, color, text } from '../../styles/theme';
import { useGetETHBalance } from '../../wallet/hooks/useGetETHBalance';
import type { EthBalanceReact } from '../types';
import { useIdentityContext } from './IdentityProvider';

export function EthBalance({ address, className }: EthBalanceReact) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error(
      'Address: an Ethereum address must be provided to the Identity or EthBalance component.',
    );
    return null;
  }

  const { convertedBalance: balance, error } = useGetETHBalance(
    address ?? contextAddress,
  );

  if (!balance || error) {
    return null;
  }

  return (
    <span
      data-testid="ockEthBalance"
      className={cn(text.label2, color.foregroundMuted, className)}
    >
      {getRoundedAmount(balance, 4)} ETH
    </span>
  );
}
