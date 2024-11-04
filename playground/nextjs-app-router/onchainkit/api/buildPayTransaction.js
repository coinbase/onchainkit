import { CDP_HYDRATE_CHARGE, CDP_CREATE_PRODUCT_CHARGE } from '../network/definitions/pay.js';
import { sendRequest } from '../network/request.js';
import { getPayErrorMessage } from './utils/getPayErrorMessage.js';
async function buildPayTransaction({
  address,
  chargeId,
  productId
}) {
  try {
    let res;
    if (chargeId) {
      res = await sendRequest(CDP_HYDRATE_CHARGE, [{
        sender: address,
        chargeId
      }]);
    } else if (productId) {
      res = await sendRequest(CDP_CREATE_PRODUCT_CHARGE, [{
        sender: address,
        productId
      }]);
    } else {
      return {
        code: 'AmBPTa01',
        // Api Module Build Pay Transaction Error 01
        error: 'No chargeId or productId provided',
        message: getPayErrorMessage()
      };
    }
    if (res.error) {
      return {
        code: 'AmBPTa02',
        // Api Module Build Pay Transaction Error 02
        error: res.error.message,
        message: getPayErrorMessage(res.error?.code)
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: 'AmBPTa03',
      // Api Module Build Pay Transaction Error 03
      error: 'Something went wrong',
      message: getPayErrorMessage()
    };
  }
}
export { buildPayTransaction };
//# sourceMappingURL=buildPayTransaction.js.map
