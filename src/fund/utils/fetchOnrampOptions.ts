import { convertSnakeToCamelCase } from '../../core/utils/convertSnakeToCamelCase';
import { getApiKey } from '../../core/utils/getApiKey';
import { ONRAMP_API_BASE_URL } from '../constants';
import type { OnrampPaymentCurrency, OnrampPurchaseCurrency } from '../types';

type OnrampOptionsResponseData = {
  /**
   * List of supported fiat currencies that can be exchanged for crypto on Onramp in the given location.
   * Each currency contains a list of available payment methods, with min and max transaction limits for that currency.
   */
  paymentCurrencies: OnrampPaymentCurrency[];
  /**
   * List of available crypto assets that can be bought on Onramp in the given location.
   */
  purchaseCurrencies: OnrampPurchaseCurrency[];
};

/**
 * Returns supported fiat currencies and available crypto assets that can be passed into the Buy Quote API.
 *
 * @param country ISO 3166-1 two-digit country code string representing the purchasing user’s country of residence, e.g., US. `required`
 * @param subdivision ISO 3166-2 two-digit country subdivision code representing the purchasing user’s subdivision of residence within their country, e.g. `NY`.
 */
export async function fetchOnrampOptions({
  country,
  subdivision,
}: {
  country: string;
  subdivision?: string;
}): Promise<OnrampOptionsResponseData> {
  const apiKey = getApiKey();

  const response = await fetch(
    `${ONRAMP_API_BASE_URL}/buy/options?country=${country}&subdivision=${subdivision}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  const responseJson = await response.json();

  return convertSnakeToCamelCase<OnrampOptionsResponseData>(responseJson.data);
}
