function formatTokenAmount(amount, decimals) {
  // Convert the string amount to a number using decimals value
  const numberAmount = Number(amount) / 10 ** decimals;
  return numberAmount.toString();
}
export { formatTokenAmount };
//# sourceMappingURL=formatTokenAmount.js.map
