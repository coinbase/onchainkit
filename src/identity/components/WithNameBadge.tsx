import type { Address, Chain } from 'viem';
import { useAttestAddress } from '../hooks/useAttestAddress';
import { Badge } from './Badge';

type WithNameBadgeInnerProps = {
  children: React.ReactNode;
  address: Address;
  chain?: Chain;
};

function WithNameBadgeInner({ children, address, chain }: WithNameBadgeInnerProps) {
  const attested = useAttestAddress({ address, chain });

  return (
    <div data-testid="inner" style={{ display: 'flex', alignItems: 'center' }}>
      {children}
      {attested && (
        <div style={{ marginLeft: '4px' }}>
          <Badge />
        </div>
      )}
    </div>
  );
}

type WithNameBadgeProps = {
  children: React.ReactNode;
  attest?: boolean;
  address: Address;
  chain?: Chain;
};

export function WithNameBadge({ children, attest, address, chain }: WithNameBadgeProps) {
  if (!attest) return children;

  return (
    <WithNameBadgeInner address={address} chain={chain}>
      {children}
    </WithNameBadgeInner>
  );
}
