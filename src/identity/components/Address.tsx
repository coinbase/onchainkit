import { cn, text } from '../../styles/theme';
import { getSlicedAddress } from '../getSlicedAddress';
import type { AddressReact } from '../types';
import { useIdentityContext } from './IdentityProvider';

export function Address({
  address = null,
  className,
  isSliced = true,
}: AddressReact) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    throw new Error(
      'Address: an Ethereum address must be provided to the Identity or Address component.',
    );
  }

  const accountAddress = address ?? contextAddress;

  return (
    <span data-testid="ockAddress" className={cn(text.label2, className)}>
      {isSliced ? getSlicedAddress(accountAddress) : accountAddress}
    </span>
  );
}
