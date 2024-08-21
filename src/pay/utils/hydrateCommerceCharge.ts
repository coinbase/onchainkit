import { base } from 'viem/chains';
import type { CommerceCharge } from '../types/charge';
import { parseCommerceApiError } from './handleCommerceApiError';

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
      chain_id: base.id,
      sender: senderAddress,
    }),
  };
  const resp = await fetch(options.url, options);
  if (!resp.ok) {
    throw await parseCommerceApiError(resp);
  }
  return (await resp.json()) as { data: CommerceCharge };
}
