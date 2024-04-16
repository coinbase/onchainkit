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
    <div style={{ position: 'relative', width: '32px', height: '32px' }}>
      {children}
      {verified && (
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            background: 'white',
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

type WithBadgeProps = {
  children: React.ReactNode;
  displayBadge: boolean;
  address: Address;
};

export function WithAvatarBadge({ children, displayBadge, address }: WithBadgeProps) {
  if (!displayBadge) return children;

  return <DisplayBadge address={address}>{children}</DisplayBadge>;
}
