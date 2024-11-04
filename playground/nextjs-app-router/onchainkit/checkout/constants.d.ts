export declare const GENERAL_CHECKOUT_ERROR_MESSAGE = "CHECKOUT_ERROR";
export declare const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";
export declare const NO_CONTRACTS_ERROR = "Contracts are not available";
export declare const NO_CONNECTED_ADDRESS_ERROR = "No connected address";
export declare const CHECKOUT_UNSUPPORTED_CHAIN_ERROR_MESSAGE = "UNSUPPORTED_CHAIN";
export declare const CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE = "CHECKOUT_TOO_MANY_REQUESTS_ERROR";
export declare const CHECKOUT_INSUFFICIENT_BALANCE_ERROR = "User has insufficient balance";
export declare const CHECKOUT_INSUFFICIENT_BALANCE_ERROR_MESSAGE: (priceInUSD: string) => string;
export declare const CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE = "CHECKOUT_INVALID_CHARGE_ERROR";
export declare const CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE = "CHECKOUT_INVALID_PARAMETER_ERROR";
export declare const UNCAUGHT_CHECKOUT_ERROR_MESSAGE = "UNCAUGHT_CHECKOUT_ERROR";
export declare const USER_REJECTED_ERROR = "Request denied.";
export declare enum CheckoutErrorCode {
    INSUFFICIENT_BALANCE = "insufficient_balance",
    GENERIC_ERROR = "generic_error",
    UNEXPECTED_ERROR = "unexpected_error",
    USER_REJECTED_ERROR = "user_rejected"
}
export interface CheckoutErrorType {
    code: CheckoutErrorCode;
    error: string;
    message: string;
}
export type CheckoutErrors = {
    [K in CheckoutErrorCode]: CheckoutErrorType;
};
export declare enum CHECKOUT_LIFECYCLESTATUS {
    FETCHING_DATA = "fetchingData",
    INIT = "init",
    PENDING = "pending",
    READY = "ready",
    SUCCESS = "success",
    ERROR = "error"
}
export declare const USDC_ADDRESS_BASE = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
export declare enum CONTRACT_METHODS {
    APPROVE = "approve",
    BALANCE_OF = "balanceOf",
    TRANSFER_TOKEN_PRE_APPROVED = "transferTokenPreApproved"
}
export declare const COMMERCE_ABI: readonly [{
    readonly type: "function";
    readonly name: "transferTokenPreApproved";
    readonly inputs: readonly [{
        readonly name: "_intent";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "recipientAmount";
            readonly type: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly name: "recipientCurrency";
            readonly type: "address";
        }, {
            readonly name: "refundDestination";
            readonly type: "address";
        }, {
            readonly name: "feeAmount";
            readonly type: "uint256";
        }, {
            readonly name: "id";
            readonly type: "bytes16";
        }, {
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
        }, {
            readonly name: "prefix";
            readonly type: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}];
//# sourceMappingURL=constants.d.ts.map