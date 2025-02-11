import type {
  ContractFunctionExecutionError,
  UserRejectedRequestError,
} from 'viem';

export function isUserRejectedRequestError(err: unknown) {
  if (
    (err as ContractFunctionExecutionError)?.cause?.name ===
      'UserRejectedRequestError' ||
    (err as UserRejectedRequestError)?.name === 'UserRejectedRequestError'
  ) {
    return true;
  }
  if (
    (err as ContractFunctionExecutionError)?.shortMessage?.includes(
      'User rejected the request.',
    )
  ) {
    return true;
  }
  return false;
}
