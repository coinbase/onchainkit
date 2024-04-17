/**
 * Checks if a given hash has a given length.
 *
 * @param {string} hash - hash to be checked.
 * @param {number} length - length of hash.
 * @returns {boolean} True if hash matches the given length, false otherwise.
 */
export function checkHashLength(hash: string, length: number): hash is `0x${string}` {
  return new RegExp(`^0x[a-fA-F0-9]{${length}}$`).test(hash);
}
