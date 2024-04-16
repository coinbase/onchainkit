import type { Address } from 'viem';
import { useVerified } from '../../hooks/useVerified';
import { Badge } from './Badge';

type DisplayBadgeProps = {
  children: React.ReactNode;
  address: Address;
};

function DisplayBadge({ children, address }: DisplayBadgeProps) {
  const verified = useVerified(address);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {children}
      {verified && (
        <div style={{ marginLeft: '4px' }}>
          <Badge />
        </div>
      )}
    </div>
  );
}

type WithNameBadgeProps = {
  children: React.ReactNode;
  displayBadge?: boolean;
  address: Address;
};

export function WithNameBadge({ children, displayBadge, address }: WithNameBadgeProps) {
  if (!displayBadge) return children;

  return <DisplayBadge address={address}>{children}</DisplayBadge>;
}
