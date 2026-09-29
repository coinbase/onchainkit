import type { Hex } from 'viem';

export const toBase64Url = (str: string) => {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const fromBase64Url = (str: string) => {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
};

/**
 * Decode an accountAssociation `signature` field to hex.
 *
 * Two encodings exist in the wild and both are legitimate:
 *
 *   - base64url of the raw signature bytes. This is the canonical form -- it is what
 *     @farcaster/miniapp-node's JFS codec both emits and parses -- and it is the majority
 *     of live manifests.
 *   - base64url of the ASCII string "0x...", which is what this package's own
 *     useSignManifest produces (toBase64Url of wagmi's hex signature).
 *
 * The spec's own examples use one of each, so a validator has to accept both. Decoding
 * only the second form turns every manifest signed by other tooling into a bogus
 * "invalid signature length".
 */
export const decodeSignature = (encoded: string): Hex => {
  const binary = fromBase64Url(encoded);
  const text = binary.trim();

  if (/^0x[0-9a-fA-F]+$/.test(text) && text.length % 2 === 0) {
    return text as Hex;
  }

  let hex = '';
  for (let i = 0; i < binary.length; i++) {
    hex += binary.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return `0x${hex}` as Hex;
};
