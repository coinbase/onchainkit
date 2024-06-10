import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { Badge } from './Badge';
import type { WithAvatarBadgeInnerReact, WithAvatarBadgeReact } from '../types';

const ERROR_MESSAGE =
  'EAS schemaId must provided in OnchainKitProvider context when using WithNameBadge showAttestation is true.';

function WithAvatarBadgeInner({ children, address }: WithAvatarBadgeInnerReact) {
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
    <div className="relative h-8 w-8" data-testid="ockAvatarBadgeContainer">
      {children}
      {attestations && attestations[0] && (
        <div className="absolute -bottom-0.5 -right-0.5 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-transparent">
          <div className="flex h-[11px] w-[11px] items-center justify-center">
            <Badge />
          </div>
        </div>
      )}
    </div>
  );
}

export function WithAvatarBadge({ children, showAttestation, address }: WithAvatarBadgeReact) {
  if (!showAttestation) {
    return children;
  }
  return <WithAvatarBadgeInner address={address}>{children}</WithAvatarBadgeInner>;
}
