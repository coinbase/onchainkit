import type { NFTError } from '@/api/types';

export function isNFTError(response: unknown): response is NFTError {
  return (
    response !== null && typeof response === 'object' && 'error' in response
  );
}
