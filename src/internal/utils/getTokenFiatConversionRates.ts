type CdpExchangeRatesResponse = {
  data: {
    currency: string;
    rates: {
      [key: string]: number;
    };
  };
};

export default async function getTokenFiatValue(
  tokenSymbol: string,
  fiatCurrency: string,
) {
  if (!tokenSymbol || !fiatCurrency) {
    throw new Error('Invalid token symbol or fiat currency');
  }

  const url = `https://api.coinbase.com/v2/exchange-rates?currency=${tokenSymbol}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch fiat value for token ${tokenSymbol}`);
    }

    const data = (await response.json()) as CdpExchangeRatesResponse;

    if (!data.data.rates[fiatCurrency]) {
      throw new Error(
        `Could not find conversion rate between ${fiatCurrency} and ${tokenSymbol}`,
      );
    }

    return data.data.rates[fiatCurrency];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Error fetching fiat value for token ${tokenSymbol}: ${error}`,
    );
  }
}
