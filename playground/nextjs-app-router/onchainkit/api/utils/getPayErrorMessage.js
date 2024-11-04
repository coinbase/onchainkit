import { UNCAUGHT_CHECKOUT_ERROR_MESSAGE, CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE, CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE, CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE, GENERAL_CHECKOUT_ERROR_MESSAGE } from '../../checkout/constants.js';
function getPayErrorMessage(errorCode) {
  if (!errorCode) {
    return UNCAUGHT_CHECKOUT_ERROR_MESSAGE;
  }
  if (errorCode === -32001) {
    return CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE;
  }
  if (errorCode === -32601) {
    return CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE;
  }
  if (errorCode === -32602) {
    return CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE;
  }
  return GENERAL_CHECKOUT_ERROR_MESSAGE;
}
export { getPayErrorMessage };
//# sourceMappingURL=getPayErrorMessage.js.map
