import { ONRAMP_API_BASE_URL } from '../constants';

type OnRampConfigResponseData = {
  countries: OnRampConfigCountry[];
};

type OnRampConfigCountry = {
  id: string;
  subdivisions: string[];
  payment_methods: OnRampConfigPaymentMethod[];
};

type OnRampConfigPaymentMethod = {
  id: string;
};

export async function fetchOnRampConfig(): Promise<OnRampConfigResponseData> {
  const response = await fetch(`${ONRAMP_API_BASE_URL}/buy/config`, {
    method: 'GET',
  });

  const responseJson = await response.json();

  const data: OnRampConfigResponseData = responseJson.data;

  return data;
}
