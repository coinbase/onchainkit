import { buildMintTransaction } from '../../api/buildMintTransaction.js';
async function getMintTransaction({
  mintAddress,
  tokenId,
  network,
  quantity,
  takerAddress
}) {
  const mintTransactions = await buildMintTransaction({
    mintAddress,
    tokenId,
    network,
    quantity,
    takerAddress
  });
  if ('error' in mintTransactions) {
    throw mintTransactions.message;
  }
  return [{
    to: mintTransactions.call_data.to,
    data: mintTransactions.call_data.data,
    value: BigInt(mintTransactions.call_data.value)
  }];
}
function buildMintTransactionData({
  contractAddress,
  takerAddress,
  tokenId,
  quantity,
  network
}) {
  return getMintTransaction({
    mintAddress: contractAddress,
    takerAddress,
    tokenId,
    quantity,
    network
  });
}
export { buildMintTransactionData };
//# sourceMappingURL=buildMintTransactionData.js.map
