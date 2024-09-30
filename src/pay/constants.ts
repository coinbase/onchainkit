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
