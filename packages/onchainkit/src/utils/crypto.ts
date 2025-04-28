// Secure fallback using crypto.getRandomValues
const getRandomValues = (size: number) => {
  const array = new Uint8Array(size);
  crypto.getRandomValues(array);
  return array;
};

/**
 * Generates a UUID using the crypto API if available, otherwise falls back to a
 * more insecure method. Only use this for non-critical purposes.
 *
 * @returns A UUID string that may not be cryptographically secure
 */
export const generateUUIDWithInsecureFallback = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  const bytes = getRandomValues(16);
  // Format the random bytes into a UUID string
  return (
    bytes[0].toString(16).padStart(2, '0') +
    bytes[1].toString(16).padStart(2, '0') +
    bytes[2].toString(16).padStart(2, '0') +
    bytes[3].toString(16).padStart(2, '0') +
    '-' +
    bytes[4].toString(16).padStart(2, '0') +
    bytes[5].toString(16).padStart(2, '0') +
    '-' +
    ((bytes[6] & 0x0f) | 0x40).toString(16).padStart(2, '0') + // UUID version 4
    bytes[7].toString(16).padStart(2, '0') +
    '-' +
    ((bytes[8] & 0x3f) | 0x80).toString(16).padStart(2, '0') + // UUID variant
    bytes[9].toString(16).padStart(2, '0') +
    '-' +
    bytes[10].toString(16).padStart(2, '0') +
    bytes[11].toString(16).padStart(2, '0') +
    bytes[12].toString(16).padStart(2, '0') +
    bytes[13].toString(16).padStart(2, '0') +
    bytes[14].toString(16).padStart(2, '0') +
    bytes[15].toString(16).padStart(2, '0')
  );
};
