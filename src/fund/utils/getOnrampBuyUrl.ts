import { GetOnrampUrlWithProjectIdParams, GetOnrampUrlWithSessionTokenParams } from "../types";

const ONRAMP_BUY_URL = 'https://pay.coinbase.com/buy';

/**
 * Builds a Coinbase Onramp buy URL using the provided parameters.
 * @param projectId a projectId generated in the Coinbase Developer Portal
 * @returns the URL
 */
export function getOnrampBuyUrl({
  projectId,
  ...props
}: GetOnrampUrlWithProjectIdParams | GetOnrampUrlWithSessionTokenParams) {
  const url = new URL(ONRAMP_BUY_URL);

  if (projectId !== undefined) {
    // Coinbase Onramp requires projectId to be passed as appId
    url.searchParams.append('appId', projectId);
  }

  (Object.keys(props) as (keyof typeof props)[]).forEach((key) => {
    const value = props[key];
    if (value !== undefined) {
      if (['string', 'number', 'boolean'].includes(typeof value)) {
        url.searchParams.append(key, value.toString());
      } else {
        url.searchParams.append(key, JSON.stringify(value));
      }
    }
  });

  url.searchParams.sort();

  return url.toString();
}
