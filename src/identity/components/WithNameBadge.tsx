import type { Address } from 'viem';

import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { Badge } from './Badge';

type WithNameBadgeInnerProps = {
  children: React.ReactNode;
  address: Address;
};

function WithNameBadgeInner({ children, address }: WithNameBadgeInnerProps) {
  const onchainKitContext = useOnchainKit();
  const attestations = useAttestations({
    address,
    chain: onchainKitContext?.chain,
    schemaId: onchainKitContext?.schemaId,
  });
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
