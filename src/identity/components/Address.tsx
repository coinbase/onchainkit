import { cn, color, text } from '../../styles/theme';
import type { AddressReact } from '../types';
import { getSlicedAddress } from '../utils/getSlicedAddress';
import { useIdentityContext } from './IdentityProvider';

export function Address({
  address = null,
  className,
  isSliced = true,
}: AddressReact) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error(
      'Address: an Ethereum address must be provided to the Identity or Address component.',
    );
    return null;
  }

  const accountAddress = address ?? contextAddress;

  return (
    <span
      data-testid="ockAddress"
      className={cn(color.foreground, text.label2, className)}
    >
      {isSliced ? getSlicedAddress(accountAddress) : accountAddress}
    </span>
  );
}
