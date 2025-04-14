import { useCallback } from 'react';
import { createPublicClient, Hex, http, verifyMessage } from 'viem';
import { optimism } from 'viem/chains';
import { fromBase64Url } from '../utilities/base64';
import { ID_REGISTRY_ABI, ID_REGISTRY_ADDRESS } from '../constants';
import { AccountAssociation } from '../types';

type ValidateManifestReturnType = (
  accountAssociation: AccountAssociation,
) => Promise<ValidateManifestResult | undefined>;

export type ValidateManifestResult = {
  fid: number;
  type: string;
  key: `0x${string}`;
  custodyAddress: `0x${string}`;
  domain: string;
};

export function useValidateManifest(): ValidateManifestReturnType {
  return useCallback(async function validateManifest(
    accountAssociation: AccountAssociation,
  ) {
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

    const { domain } = JSON.parse(fromBase64Url(encodedPayload));
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

    return {
      fid,
      type,
      key,
      custodyAddress: resolvedCustodyAddress,
      domain,
    };
  }, []);
}
