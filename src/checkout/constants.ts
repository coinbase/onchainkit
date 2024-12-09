export const GENERAL_CHECKOUT_ERROR_MESSAGE = 'CHECKOUT_ERROR';
export const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';
export const NO_CONTRACTS_ERROR = 'Contracts are not available';
export const NO_CONNECTED_ADDRESS_ERROR = 'No connected address';
export const CHECKOUT_UNSUPPORTED_CHAIN_ERROR_MESSAGE = 'UNSUPPORTED_CHAIN';
export const CHECKOUT_TOO_MANY_REQUESTS_ERROR_MESSAGE =
  'CHECKOUT_TOO_MANY_REQUESTS_ERROR';

export const CHECKOUT_INSUFFICIENT_BALANCE_ERROR =
  'User has insufficient balance';
export const CHECKOUT_INVALID_CHARGE_ERROR_MESSAGE =
  'CHECKOUT_INVALID_CHARGE_ERROR';
export const CHECKOUT_INVALID_PARAMETER_ERROR_MESSAGE =
  'CHECKOUT_INVALID_PARAMETER_ERROR';
export const UNCAUGHT_CHECKOUT_ERROR_MESSAGE = 'UNCAUGHT_CHECKOUT_ERROR';
export const USER_REJECTED_ERROR = 'Request denied.';

export enum CheckoutErrorCode {
  INSUFFICIENT_BALANCE = 'insufficient_balance',
  GENERIC_ERROR = 'generic_error',
  UNEXPECTED_ERROR = 'unexpected_error',
  USER_REJECTED_ERROR = 'user_rejected',
}

export interface CheckoutErrorType {
  code: CheckoutErrorCode;
  error: string;
  message: string;
}

export type CheckoutErrors = {
  [K in CheckoutErrorCode]: CheckoutErrorType;
};

export enum CHECKOUT_LIFECYCLESTATUS {
  FETCHING_DATA = 'fetchingData',
  INIT = 'init',
  PENDING = 'pending',
  READY = 'ready',
  SUCCESS = 'success',
  ERROR = 'error',
}

export const USDC_ADDRESS_BASE = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

export enum CONTRACT_METHODS {
  APPROVE = 'approve',
  BALANCE_OF = 'balanceOf',
  TRANSFER_TOKEN_PRE_APPROVED = 'transferTokenPreApproved',
}

export const COMMERCE_ABI = [
  {
    type: 'function',
    name: 'transferTokenPreApproved',
    inputs: [
      {
        name: '_intent',
        type: 'tuple',
        components: [
          {
            name: 'recipientAmount',
            type: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
          },
          {
            name: 'recipient',
            type: 'address',
          },
          {
            name: 'recipientCurrency',
            type: 'address',
          },
          {
            name: 'refundDestination',
            type: 'address',
          },
          {
            name: 'feeAmount',
            type: 'uint256',
          },
          {
            name: 'id',
            type: 'bytes16',
          },
          {
            name: 'operator',
            type: 'address',
          },
          {
            name: 'signature',
            type: 'bytes',
          },
          {
            name: 'prefix',
            type: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
