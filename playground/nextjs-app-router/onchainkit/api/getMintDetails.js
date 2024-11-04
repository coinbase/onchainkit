import { CDP_GET_MINT_DETAILS } from '../network/definitions/nft.js';
import { sendRequest } from '../network/request.js';

/**
 * Retrieves mint details for an NFT contract and token ID
 */
async function getMintDetails({
  contractAddress,
  takerAddress,
  tokenId
}) {
  try {
    const res = await sendRequest(CDP_GET_MINT_DETAILS, [{
      contractAddress,
      takerAddress,
      tokenId
    }]);
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error fetching mint details',
        message: res.error.message
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error fetching mint details'
    };
  }
}
export { getMintDetails };
//# sourceMappingURL=getMintDetails.js.map
