const WEI_IN_ETHER = 1e18;

export const convertToUSD = async (wei: string): Promise<number> => {
  const ether = Number.parseFloat(wei) / WEI_IN_ETHER;

  // Fetch the current ETH to USD exchange rate
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  const data = await response.json();
  const ethToUsdRate = data.ethereum.usd;

  // Convert Ether to USD
  const usdValue = ether * ethToUsdRate;
  return usdValue;
};

export const convertWeiToEther = (wei: string): number => {
  return Number.parseFloat(wei) / WEI_IN_ETHER;
};