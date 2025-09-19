import { version } from '@/version';
import { ONRAMP_BUY_URL } from '../constants';
import type { GetOnrampUrlParams } from '../types';

/**
 * Builds a Coinbase Onramp buy URL using the provided parameters.
 * @param projectId a projectId generated in the Coinbase Developer Portal
 * @returns the URL
 */
export function getOnrampBuyUrl({
  originComponentName,
  ...props
}: GetOnrampUrlParams) {
  const url = new URL(ONRAMP_BUY_URL);

  for (const key of Object.keys(props) as Array<keyof typeof props>) {
    const value = props[key];
    if (value !== undefined) {
      if (['string', 'number', 'boolean'].includes(typeof value)) {
        url.searchParams.append(key, value.toString());
      } else {
        url.searchParams.append(key, JSON.stringify(value));
      }
    }
  }

  if (originComponentName) {
    url.searchParams.append(
      'sdkVersion',
      `onchainkit@${version}:${originComponentName}`,
    );
  } else {
    url.searchParams.append('sdkVersion', `onchainkit@${version}`);
  }

  url.searchParams.sort();

  return url.toString();
}
