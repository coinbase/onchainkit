import type { Address, Chain } from 'viem';
import { useAttestation } from '../hooks/useAttestation';
import { Badge } from './Badge';

type WithNameBadgeInnerProps = {
  children: React.ReactNode;
  address: Address;
  chain?: Chain;
};

function WithNameBadgeInner({ children, address, chain }: WithNameBadgeInnerProps) {
  const attested = useAttestation({ address, chain });

  return (
    <div data-testid="inner" style={{ display: 'flex', alignItems: 'center' }}>
      {children}
      {attested === 'eas' && (
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
  chain?: Chain;
};

export function WithNameBadge({ children, showAttestation, address, chain }: WithNameBadgeProps) {
  if (!showAttestation) return children;

  return (
    <WithNameBadgeInner address={address} chain={chain}>
      {children}
    </WithNameBadgeInner>
  );
}
