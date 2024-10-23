import type { SocialsReact } from '../types';
import { useIdentityContext } from './IdentityProvider';

export function Socials({
  address = null,
}: SocialsReact) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error(
      'Socials: an Ethereum address must be provided to the Socials component.',
    );
    return null;
  }

  return 
}