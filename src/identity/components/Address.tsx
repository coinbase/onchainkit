import { useIdentityContext } from './IdentityProvider';
import { getSlicedAddress } from '../getSlicedAddress';
import { cn, text } from '../../styles/theme';
import type { AddressReact } from '../types';

export function Address({
  address = null,
  isSliced = true,
  className,
}: AddressReact) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    throw new Error(
      'Address: an Ethereum address must be provided to the Identity or Address component.',
    );
  }

  const displayAddress = contextAddress ?? address;

  return (
    <span data-testid="ockAddress" className={cn(text.label2, className)}>
      {isSliced ? getSlicedAddress(displayAddress) : displayAddress}
    </span>
  );
}