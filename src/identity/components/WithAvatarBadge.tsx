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
    <div style={{ position: 'relative', width: '32px', height: '32px' }} data-testid="inner">
      {children}
      {attestations && attestations[0] && (
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            background: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '15px',
            height: '15px',
            borderRadius: '9999px',
          }}
        >
          <div
            style={{
              width: '11px',
              height: '11px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
