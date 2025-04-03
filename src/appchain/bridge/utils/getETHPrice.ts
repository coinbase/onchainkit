interface CoinbaseResponse {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
}

export async function getETHPrice(): Promise<string> {
  try {
    const response = await fetch(
      'https://api.coinbase.com/v2/prices/ETH-USD/spot',
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CoinbaseResponse = await response.json();
    const amount = data.data.amount;

    return amount;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    return '0';
  }
}
