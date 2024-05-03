import { useName } from '../hooks/useName';
import { WithNameBadge } from './WithNameBadge';
import { NameReact } from '../types';

/**
 * Name is a React component that renders the user name from an Ethereum address.
 * It displays the ENS name if available; otherwise, it shows either a sliced version of the address
 * or the full address, based on the 'sliced' prop. By default, 'sliced' is set to true.
 */
export function Name({ address, className, showAddress, showAttestation, props }: NameReact) {
  const { data: name, isLoading } = useName({ address, showAddress });

  if (isLoading) {
    return <span className={className} {...props} />;
  }

  return (
    <WithNameBadge showAttestation={showAttestation} address={address}>
      <span className={className} {...props}>
        {name}
      </span>
    </WithNameBadge>
  );
}
