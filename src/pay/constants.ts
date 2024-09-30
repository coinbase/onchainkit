export const GENERAL_PAY_ERROR_MESSAGE = 'PAY_ERROR';
export const PAY_UNSUPPORTED_CHAIN_ERROR_MESSAGE = 'UNSUPPORTED_CHAIN';
export const PAY_TOO_MANY_REQUESTS_ERROR_MESSAGE =
  'PAY_TOO_MANY_REQUESTS_ERROR';

export const PAY_INSUFFICIENT_BALANCE_ERROR = 'User has insufficient balance';
export const PAY_INSUFFICIENT_BALANCE_ERROR_MESSAGE =
  "You don't have enough USDC. Add funds and try again.";
export const PAY_INVALID_CHARGE_ERROR_MESSAGE = 'PAY_INVALID_CHARGE_ERROR';
export const PAY_INVALID_PARAMETER_ERROR_MESSAGE =
  'PAY_INVALID_PARAMETER_ERROR';
export const UNCAUGHT_PAY_ERROR_MESSAGE = 'UNCAUGHT_PAY_ERROR';

export enum PayErrorCode {
  INSUFFICIENT_BALANCE = 'insufficient_balance',
  GENERIC_ERROR = 'generic_error',
  UNEXPECTED_ERROR = 'unexpected_error',
}

export interface PayErrorType {
  code: PayErrorCode;
  error: string;
  message: string;
}

export type PayErrors = {
  [K in PayErrorCode]: PayErrorType;
};

export enum PAY_LIFECYCLESTATUS {
  INIT = 'init',
  PENDING = 'paymentPending',
  SUCCESS = 'success',
  ERROR = 'error',
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
