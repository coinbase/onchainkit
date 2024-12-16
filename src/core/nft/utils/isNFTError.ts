import type { NFTError } from '@/core/api/types';

export function isNFTError(response: unknown): response is NFTError {
  return (
    response !== null && typeof response === 'object' && 'error' in response
  );
}
