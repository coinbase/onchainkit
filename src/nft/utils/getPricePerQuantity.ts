export function getPricePerQuantity(price: string, quantity: number) {
  // calculate multiplier to avoid floating point errors
  const multiplier = price.includes('.') ? 10 ** price.split('.')[1].length : 1;

  const multipliedPrice =
    BigInt(Math.round(Number(price) * multiplier)) * BigInt(quantity);

  return `${Number(multipliedPrice) / multiplier}`;
}
