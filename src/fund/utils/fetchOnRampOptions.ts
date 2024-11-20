import { ONRAMP_API_BASE_URL } from '../constants';

type OnRampOptionsResponseData = {
  payment_currencies: OnRampOptionsPaymentCurrency[];
  purchase_currencies: OnRampOptionsPurchaseCurrency[];
};

type OnRampOptionsPaymentCurrency = {
  id: string;
  payment_method_limits: OnRampOptionsPaymentMethodLimit[];
};

type OnRampOptionsPaymentMethodLimit = {
  id: string;
  min: string;
  max: string;
};

type OnRampOptionsPurchaseCurrency = {
  id: string;
  name: string;
  symbol: string;
  networks: OnRampOptionsNetwork[];
};

type OnRampOptionsNetwork = {
  name: string;
  display_name: string;
  chain_id: string;
  contract_address: string;
};

export async function fetchOnRampOptions({
  country,
  subdivision,
}: {
  country: string;
  subdivision?: string;
}): Promise<OnRampOptionsResponseData> {
  const response = await fetch(
    `${ONRAMP_API_BASE_URL}/buy/options?country=${country}&subdivision=${subdivision}`,
    {
      method: 'GET',
    }
  );

  const responseJson = await response.json();

  const data: OnRampOptionsResponseData = responseJson.data;

  return data;
}
