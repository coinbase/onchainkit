import { CDP_GET_TOKEN_DETAILS } from '../network/definitions/nft.js';
import { sendRequest } from '../network/request.js';

/**
 * Retrieves token details for an NFT contract and token ID
 */
async function getTokenDetails({
  contractAddress,
  tokenId
}) {
  try {
    const res = await sendRequest(CDP_GET_TOKEN_DETAILS, [{
      contractAddress,
      tokenId
    }]);
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error fetching token details',
        message: res.error.message
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error fetching token details'
    };
  }
}
export { getTokenDetails };
//# sourceMappingURL=getTokenDetails.js.map
