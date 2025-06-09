import { ApiErrorCode } from '../constants';

export const buildErrorStruct = ({
  code,
  error,
  message,
}: {
  code: ApiErrorCode | string;
  error?: string;
  message?: string;
}) => {
  return {
    code,
    error: error ?? 'Something went wrong',
    message: message ?? 'Request failed, please try again later',
  };
};
