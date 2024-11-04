import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless';

/**
 * Verify the Account-Abstraction entrypoint before sponsoring a transaction.
 */
function isValidAAEntrypoint({
  entrypoint
}) {
  if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase()) {
    return false;
  }
  return true;
}
export { isValidAAEntrypoint };
//# sourceMappingURL=isValidAAEntrypoint.js.map
