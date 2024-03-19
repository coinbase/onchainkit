import type { Address } from 'viem';
import { Badge } from './Badge';
import { useVerified } from './useVerified';

type NameBadgeProps = {
  address: Address;
};

export function NameBadge({ address }: NameBadgeProps) {
  const verified = useVerified(address);

  if (!verified) {
    return null;
  }

  return (
    <div style={{ marginLeft: '4px' }}>
      <Badge />
    </div>
  );
}
