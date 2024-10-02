type GetEthPriceResponse = {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
};

export async function getEthPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coinbase.com/v2/prices/ETH-USD/spot',
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GetEthPriceResponse = await response.json();
    const amount = data.data.amount;

    return Number.parseFloat(amount);
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    return 0;
  }
}
