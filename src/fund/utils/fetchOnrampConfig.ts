import { convertSnakeToCamelCase } from '@/internal/utils/convertSnakeToCamelCase';
import { getApiKey } from '@/internal/utils/getApiKey';
import { ONRAMP_API_BASE_URL } from '../constants';
import type { OnrampPaymentMethod } from '../types';

type OnrampConfigResponseData = {
  countries: OnrampConfigCountry[];
};

type OnrampConfigCountry = {
  id: string;
  subdivisions: string[];
  paymentMethods: OnrampPaymentMethod[];
};

/**
 * Returns list of countries supported by Coinbase Onramp, and the payment methods available in each country.
 *
 */
export async function fetchOnrampConfig(): Promise<OnrampConfigResponseData> {
  const apiKey = getApiKey();
  const response = await fetch(`${ONRAMP_API_BASE_URL}/buy/config`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const responseJson = await response.json();

  return convertSnakeToCamelCase<OnrampConfigResponseData>(responseJson.data);
}
