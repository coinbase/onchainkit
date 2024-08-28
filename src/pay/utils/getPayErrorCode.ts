import { GENERAL_PAY_ERROR_CODE, PAY_INVALID_PARAMETER_ERROR_CODE, PAY_TOO_MANY_REQUESTS_ERROR_CODE } from "../constants";

export function getPayErrorCode(
    errorCode?: number,
  ) {
    if (errorCode === -32001) {
      return PAY_TOO_MANY_REQUESTS_ERROR_CODE;
    }
  
    if (errorCode === -32602) {
      return PAY_INVALID_PARAMETER_ERROR_CODE;
    }
  
    return GENERAL_PAY_ERROR_CODE;
  }