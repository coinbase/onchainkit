import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless';
import { isEntrypointOptions, isEntrypointResponse } from './types';

export function isEntrypoint({ entrypoint }: isEntrypointOptions): isEntrypointResponse {
  if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase()) {
    return false;
  }

  return true;
}
