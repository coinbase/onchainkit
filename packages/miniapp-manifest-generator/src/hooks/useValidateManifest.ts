import { createPublicClient, Hex, http } from 'viem';
import { optimism } from 'viem/chains';
import type { AccountAssociation } from './useSignManifest';
import { decodeSignature, fromBase64Url } from '../utilities/base64';
import { ID_REGISTRY_ABI } from '../constants';
import { ID_REGISTRY_ADDRESS } from '../constants';
import { FARCASTER_HUB_URL } from '../constants';

type ValidateManifestProps = {
  accountAssociation: AccountAssociation | null;
};

/**
 * Is `key` one of the addresses this FID has verified? Auth addresses live in hub state
 * rather than on chain, so this is the only place to ask.
 */
async function isAuthAddressForFid(fid: number, key: string): Promise<boolean> {
  const response = await fetch(
    `${FARCASTER_HUB_URL}/v1/verificationsByFid?fid=${fid}`,
  );

  if (!response.ok) {
    throw new Error('Could not reach a Farcaster hub to check the auth address');
  }

  const body = await response.json();
  return (body.messages ?? []).some(
    (message: {
      data?: { verificationAddAddressBody?: { address?: string } };
    }) =>
      message.data?.verificationAddAddressBody?.address?.toLowerCase() ===
      key.toLowerCase(),
  );
}

export function useValidateManifest({
  accountAssociation,
}: ValidateManifestProps) {
  return async function validateManifest() {
    if (!accountAssociation) {
      return;
    }

    const {
      header: encodedHeader,
      payload: encodedPayload,
      signature: encodedSignature,
    } = accountAssociation;

    const headerData = JSON.parse(fromBase64Url(encodedHeader));
    const { fid, type, key } = headerData;

    // The spec: `The header.type must be "custody" or "auth".` Both are valid, and "auth"
    // is now the more common of the two across live manifests.
    if (type !== 'custody' && type !== 'auth') {
      throw new Error('Invalid type: type must be "custody" or "auth"');
    }

    const signature = decodeSignature(encodedSignature);

    const client = createPublicClient({
      chain: optimism,
      transport: http(),
    });

    // Verify against the client rather than viem's offline verifyMessage: smart accounts
    // sign via ERC-1271, and via ERC-6492 while they are still counterfactual on the
    // verifying chain. Offline ecrecover reports both as forgeries.
    const valid = await client.verifyMessage({
      address: key as Hex,
      message: `${encodedHeader}.${encodedPayload}`,
      signature,
    });

    if (!valid) {
      throw new Error('Invalid signature');
    }

    // A valid signature only shows the blob is self-consistent. What binds the domain to
    // an account is that the key really belongs to the FID.
    const resolvedCustodyAddress = await client.readContract({
      address: ID_REGISTRY_ADDRESS,
      abi: ID_REGISTRY_ABI,
      functionName: 'custodyOf',
      args: [BigInt(fid)],
    });

    if (resolvedCustodyAddress.toLowerCase() === key.toLowerCase()) {
      return;
    }

    if (type === 'auth') {
      if (await isAuthAddressForFid(fid, key)) {
        return;
      }
      throw new Error('Invalid auth address: not verified for this FID');
    }

    throw new Error('Invalid custody address');
  };
}
