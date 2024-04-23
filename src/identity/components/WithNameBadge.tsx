import type { Address } from 'viem';
import { useAttestations } from '../hooks/useAttestation';
import { Badge } from './Badge';

type WithNameBadgeInnerProps = {
  children: React.ReactNode;
  address: Address;
};

function WithNameBadgeInner({ children, address }: WithNameBadgeInnerProps) {
  const attestations = useAttestations({ address });
  return (
    <div data-testid="inner" style={{ display: 'flex', alignItems: 'center' }}>
      {children}
      {attestations && attestations[0] && (
        <div style={{ marginLeft: '4px' }}>
          <Badge />
        </div>
      )}
    </div>
  );
}

type WithNameBadgeProps = {
  children: React.ReactNode;
  showAttestation?: boolean;
  address: Address;
};

export function WithNameBadge({ children, showAttestation, address }: WithNameBadgeProps) {
  if (!showAttestation) {
    return children;
  }
  return <WithNameBadgeInner address={address}>{children}</WithNameBadgeInner>;
}
