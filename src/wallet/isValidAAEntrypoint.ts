import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless';
import { isValidAAEntrypointOptions, isValidAAEntrypointResponse } from './types';

export function isValidAAEntrypoint({
  entrypoint,
}: isValidAAEntrypointOptions): isValidAAEntrypointResponse {
  if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase()) {
    return false;
  }

  return true;
}
