import { FetchError } from "./FetchError";
import type { Web3Charge } from "./types/Web3Charge";

export async function getCommerceCharge(
  baseUrl: string,
  chargeId: string,
) {
  const options = {
    method: 'GET',
    url: `${baseUrl}/charges/${chargeId}`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  };
  const resp = await fetch(options.url, options);
  if (resp.status !== 200) {
    throw new FetchError(
      `non-200 status returned from neynar : ${resp.status}`,
    );
  }
  return await resp.json() as { data: Web3Charge };
}
