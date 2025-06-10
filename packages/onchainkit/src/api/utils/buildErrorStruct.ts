import { APIError } from '../types';

export const buildErrorStruct = ({ code, error, message }: APIError) => {
  return {
    code,
    error: error ?? 'Something went wrong',
    message: message ?? 'Request failed, please try again later',
  };
};
