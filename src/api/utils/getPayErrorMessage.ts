import {
  GENERAL_PAY_ERROR_MESSAGE,
  PAY_INVALID_CHARGE_ERROR_MESSAGE,
  PAY_INVALID_PARAMETER_ERROR_MESSAGE,
  PAY_TOO_MANY_REQUESTS_ERROR_MESSAGE,
  UNCAUGHT_PAY_ERROR_MESSAGE,
} from '../../pay/constants';

export function getPayErrorMessage(errorCode?: number) {
  if (!errorCode) {
    return UNCAUGHT_PAY_ERROR_MESSAGE;
  }

  if (errorCode === -32001) {
    return PAY_TOO_MANY_REQUESTS_ERROR_MESSAGE;
  }

  if (errorCode === -32601) {
    return PAY_INVALID_CHARGE_ERROR_MESSAGE;
  }

  if (errorCode === -32602) {
    return PAY_INVALID_PARAMETER_ERROR_MESSAGE;
  }

  return GENERAL_PAY_ERROR_MESSAGE;
}
