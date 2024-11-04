const GENERAL_CHECKOUT_ERROR_MESSAGE = 'CHECKOUT_ERROR';
const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const NO_CONTRACTS_ERROR = 'Contracts are not available';
const NO_CONNECTED_ADDRESS_ERROR = 'No connected address';
const CHECKOUT_UNSUPPORTED_CHAIN_ERROR_MESSAGE = 'UNSUPPORTED_CHAIN';
const CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE = 'CHECKOUT_TOO_MANY_REQUESTS_ERROR';
const CHECKOUT_INSUFFICIENT_BALANCE_ERROR = 'User has insufficient balance';
const CHECKOUT_INSUFFICIENT_BALANCE_ERROR_MESSAGE = priceInUSD => {
  return `You need at least ${priceInUSD} USDC to continue with payment`;
};
const CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE = 'CHECKOUT_INVALID_CHARGE_ERROR';
const CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE = 'CHECKOUT_INVALID_PARAMETER_ERROR';
const UNCAUGHT_CHECKOUT_ERROR_MESSAGE = 'UNCAUGHT_CHECKOUT_ERROR';
const USER_REJECTED_ERROR = 'Request denied.';
let CheckoutErrorCode = /*#__PURE__*/function (CheckoutErrorCode) {
  CheckoutErrorCode["INSUFFICIENT_BALANCE"] = "insufficient_balance";
  CheckoutErrorCode["GENERIC_ERROR"] = "generic_error";
  CheckoutErrorCode["UNEXPECTED_ERROR"] = "unexpected_error";
  CheckoutErrorCode["USER_REJECTED_ERROR"] = "user_rejected";
  return CheckoutErrorCode;
}({});
let CHECKOUT_LIFECYCLESTATUS = /*#__PURE__*/function (CHECKOUT_LIFECYCLESTATUS) {
  CHECKOUT_LIFECYCLESTATUS["FETCHING_DATA"] = "fetchingData";
  CHECKOUT_LIFECYCLESTATUS["INIT"] = "init";
  CHECKOUT_LIFECYCLESTATUS["PENDING"] = "pending";
  CHECKOUT_LIFECYCLESTATUS["READY"] = "ready";
  CHECKOUT_LIFECYCLESTATUS["SUCCESS"] = "success";
  CHECKOUT_LIFECYCLESTATUS["ERROR"] = "error";
  return CHECKOUT_LIFECYCLESTATUS;
}({});
const USDC_ADDRESS_BASE = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';
let CONTRACT_METHODS = /*#__PURE__*/function (CONTRACT_METHODS) {
  CONTRACT_METHODS["APPROVE"] = "approve";
  CONTRACT_METHODS["BALANCE_OF"] = "balanceOf";
  CONTRACT_METHODS["TRANSFER_TOKEN_PRE_APPROVED"] = "transferTokenPreApproved";
  return CONTRACT_METHODS;
}({});
const COMMERCE_ABI = [{
  type: 'function',
  name: 'transferTokenPreApproved',
  inputs: [{
    name: '_intent',
    type: 'tuple',
    components: [{
      name: 'recipientAmount',
      type: 'uint256'
    }, {
      name: 'deadline',
      type: 'uint256'
    }, {
      name: 'recipient',
      type: 'address'
    }, {
      name: 'recipientCurrency',
      type: 'address'
    }, {
      name: 'refundDestination',
      type: 'address'
    }, {
      name: 'feeAmount',
      type: 'uint256'
    }, {
      name: 'id',
      type: 'bytes16'
    }, {
      name: 'operator',
      type: 'address'
    }, {
      name: 'signature',
      type: 'bytes'
    }, {
      name: 'prefix',
      type: 'bytes'
    }]
  }],
  outputs: [],
  stateMutability: 'nonpayable'
}];
export { CHECKOUT_INSUFFICIENT_BALANCE_ERROR, CHECKOUT_INSUFFICIENT_BALANCE_ERROR_MESSAGE, CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE, CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE, CHECKOUT_LIFECYCLESTATUS, CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE, CHECKOUT_UNSUPPORTED_CHAIN_ERROR_MESSAGE, COMMERCE_ABI, CONTRACT_METHODS, CheckoutErrorCode, GENERAL_CHECKOUT_ERROR_MESSAGE, GENERIC_ERROR_MESSAGE, NO_CONNECTED_ADDRESS_ERROR, NO_CONTRACTS_ERROR, UNCAUGHT_CHECKOUT_ERROR_MESSAGE, USDC_ADDRESS_BASE, USER_REJECTED_ERROR };
//# sourceMappingURL=constants.js.map
