import { CDP_MINT_TOKEN } from '../network/definitions/nft.js';
import { sendRequest } from '../network/request.js';

/**
 * Retrieves contract to mint an nft
 */
async function buildMintTransaction({
  mintAddress,
  tokenId,
  network = '',
  quantity,
  takerAddress
}) {
  try {
    const res = await sendRequest(CDP_MINT_TOKEN, [{
      mintAddress,
      network,
      quantity,
      takerAddress,
      tokenId
    }]);
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error building mint transaction',
        message: res.error.message
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error building mint transaction'
    };
  }
}
export { buildMintTransaction };
//# sourceMappingURL=buildMintTransaction.js.map
