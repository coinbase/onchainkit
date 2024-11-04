/**
 * Constructs an unsigned transaction.
 *
 * A transaction is a message sent by an Account requesting
 * to perform an action on the Ethereum blockchain.
 *
 * Transactions can be used to transfer Ether between accounts,
 * execute smart contract code, deploy smart contracts, etc.
 */
function getSwapTransaction(rawTx, chainId) {
  const data = rawTx.data,
    gas = rawTx.gas,
    to = rawTx.to,
    value = rawTx.value;
  return {
    chainId: Number(chainId),
    data: data,
    gas: BigInt(gas),
    to: to,
    value: BigInt(value)
  };
}
export { getSwapTransaction };
//# sourceMappingURL=getSwapTransaction.js.map
