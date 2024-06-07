import type { Address } from 'viem';

import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { Badge } from './Badge';

type WithAvatarBadgeInnerProps = {
  children: React.ReactNode;
  address: Address;
};

type WithAvatarBadgeProps = {
  children: React.ReactNode;
  showAttestation: boolean;
  address: Address;
};

const ERROR_MESSAGE =
  'EAS schemaId must provided in OnchainKitProvider context when using WithNameBadge showAttestation is true.';

function WithAvatarBadgeInner({ children, address }: WithAvatarBadgeInnerProps) {
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
    <div className="ock-withavatarbadge-container" data-testid="ockAvatarBadgeContainer">
      {children}
      {attestations && attestations[0] && (
        <div className="ock-withavatarbadge-badge">
          <div className="ock-withavatarbadge-inner">
            <Badge />
          </div>
        </div>
      )}
    </div>
  );
}

export function WithAvatarBadge({ children, showAttestation, address }: WithAvatarBadgeProps) {
  if (!showAttestation) {
    return children;
  }
  return <WithAvatarBadgeInner address={address}>{children}</WithAvatarBadgeInner>;
}
