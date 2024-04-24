import type { Address } from 'viem';

import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { Badge } from './Badge';

type WithNameBadgeInnerProps = {
  children: React.ReactNode;
  address: Address;
};

type WithNameBadgeProps = {
  children: React.ReactNode;
  showAttestation?: boolean;
  address: Address;
};

const ERROR_MESSAGE =
  'EAS schemaId must provided in OnchainKitProvider context when using WithNameBadge showAttestation is true.';

function WithNameBadgeInner({ children, address }: WithNameBadgeInnerProps) {
  const onchainKitContext = useOnchainKit();
  // SchemaId is required to fetch attestations
  if (!onchainKitContext?.schemaId) {
    console.error(ERROR_MESSAGE);
    return children;
  }
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

export function WithNameBadge({ children, showAttestation, address }: WithNameBadgeProps) {
  if (!showAttestation) {
    return children;
  }
  return <WithNameBadgeInner address={address}>{children}</WithNameBadgeInner>;
}
