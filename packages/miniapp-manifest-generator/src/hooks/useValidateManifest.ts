import { createPublicClient, Hex, http, verifyMessage } from 'viem';
import { optimism } from 'viem/chains';
import type { AccountAssociation } from './useSignManifest';
import { fromBase64Url } from '../utilities/base64';
import { ID_REGISTRY_ABI } from '../constants';
import { ID_REGISTRY_ADDRESS } from '../constants';

type ValidateManifestProps = {
  accountAssociation: AccountAssociation | null;
};

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

    if (type !== 'custody') {
      throw new Error('Invalid type: type must be "custody"');
    }

    const signature = fromBase64Url(encodedSignature) as Hex;
    const valid = await verifyMessage({
      address: key,
      message: `${encodedHeader}.${encodedPayload}`,
      signature: signature,
    });

    if (!valid) {
      throw new Error('Invalid signature');
    }

    const client = createPublicClient({
      chain: optimism,
      transport: http(),
    });

    const resolvedCustodyAddress = await client.readContract({
      address: ID_REGISTRY_ADDRESS,
      abi: ID_REGISTRY_ABI,
      functionName: 'custodyOf',
      args: [BigInt(fid)],
    });

    if (resolvedCustodyAddress.toLowerCase() !== key.toLowerCase()) {
      throw new Error('Invalid custody address');
    }
  };
}
