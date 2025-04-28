/**
 * Generates a UUID using the crypto API if available, otherwise falls back to a
 * more insecure method. Only use this for non-critical purposes.
 *
 * @returns string - A UUID string that may not be cryptographically secure
 */
export const generateUUIDWithInsecureFallback = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
