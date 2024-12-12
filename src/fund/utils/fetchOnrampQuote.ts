import { convertSnakeToCamelCase } from '../../core/utils/convertSnakeToCamelCase';
import { getApiKey } from '../../core/utils/getApiKey';
import { ONRAMP_API_BASE_URL } from '../constants';
import type { OnrampAmount } from '../types';

type OnrampQuoteResponseData = {
  /**
   * Object with amount and currency of the total fiat payment required to complete the purchase, inclusive of any fees.
   * The currency will match the `paymentCurrency` in the request if it is supported, otherwise it falls back to USD.
   */
  paymentTotal: OnrampAmount;
  /**
   * Object with amount and currency of the fiat cost of the crypto asset to be purchased, exclusive of any fees.
   * The currency will match the `paymentCurrency`.
   */
  paymentSubtotal: OnrampAmount;
  /**
   * Object with amount and currency of the crypto that to be purchased.
   * The currency will match the `purchaseCurrency` in the request.
   * The number of decimals will be based on the crypto asset.
   */
  purchaseAmount: OnrampAmount;
  /**
   * Object with amount and currency of the fee changed by the Coinbase exchange to complete the transaction.
   * The currency will match the `paymentCurrency`.
   */
  coinbaseFee: OnrampAmount;
  /**
   * Object with amount and currency of the network fee required to send the purchased crypto to the user’s wallet.
   * The currency will match the `paymentCurrency`.
   */
  networkFee: OnrampAmount;
  /**
   * Reference to the quote that should be passed into the initialization parameters when launching the Coinbase Onramp widget via the SDK or URL generator.
   */
  quoteId: string;
};

/**
 * Provides a quote based on the asset the user would like to purchase, plus the network, the fiat payment, the payment currency, payment method, and country.
 *
 * @param purchaseCurrency ID of the crypto asset the user wants to purchase. Retrieved from the options API. `required`
 * @param purchaseNetwork Name of the network that the purchase currency should be purchased on.
 * Retrieved from the options API. If omitted, the default network for the crypto currency is used.
 * @param paymentCurrency Fiat currency of the payment amount, e.g., `USD`. `required`
 * @param paymentMethod ID of payment method used to complete the purchase. Retrieved from the options API. `required`
 * @param paymentAmount Fiat amount the user wants to spend to purchase the crypto currency, inclusive of fees with two decimals of precision, e.g., `100.00`. `required`
 * @param country ISO 3166-1 two-digit country code string representing the purchasing user’s country of residence, e.g., US. `required`
 * @param subdivision ISO 3166-2 two-digit country subdivision code representing the purchasing user’s subdivision of residence within their country, e.g. `NY`.
 * Required if the `country=“US”` because certain states (e.g., `NY`) have state specific asset restrictions.
 */
export async function fetchOnrampQuote({
  purchaseCurrency,
  purchaseNetwork,
  paymentCurrency,
  paymentMethod,
  paymentAmount,
  country,
  subdivision,
}: {
  purchaseCurrency: string;
  purchaseNetwork?: string;
  paymentCurrency: string;
  paymentMethod: string;
  paymentAmount: string;
  country: string;
  subdivision?: string;
}): Promise<OnrampQuoteResponseData> {
  const apiKey = getApiKey();

  const response = await fetch(`${ONRAMP_API_BASE_URL}/buy/quote`, {
    method: 'POST',
    body: JSON.stringify({
      purchase_currency: purchaseCurrency,
      purchase_network: purchaseNetwork,
      payment_currency: paymentCurrency,
      payment_method: paymentMethod,
      payment_amount: paymentAmount,
      country,
      subdivision,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const responseJson = await response.json();

  return convertSnakeToCamelCase<OnrampQuoteResponseData>(responseJson.data);
}
