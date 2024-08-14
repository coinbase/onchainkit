import { FetchError } from './FetchError';
import type { Web3Charge } from './types/Web3Charge';

export async function hydrateCommerceCharge(
  baseUrl: string,
  chargeId: string,
  senderAddress: string,
) {
  const options = {
    method: 'PUT',
    url: `${baseUrl}/charges/${chargeId}/hydrate`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      chain_id: 8453,
      sender: senderAddress,
    }),
  };
  const resp = await fetch(options.url, options);
  if (resp.status !== 200) {
    throw new FetchError(
      `non-200 status returned from neynar : ${resp.status}`,
    );
  }
  return (await resp.json()) as { data: Web3Charge };
}
